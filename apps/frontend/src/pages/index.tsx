import styles from "@/styles/Home.module.css";
import {
  BellFilled,
  UserOutlined
} from '@ant-design/icons/lib/icons';
import { gql, useMutation, useQuery } from "@apollo/client";
import { Avatar, Badge, Button, Checkbox, Col, Input, List, Row, Space, Typography } from 'antd';
import useNotification from "antd/es/notification/useNotification";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GET_TODOS = gql`
  query getTodos {
    getTodos {
      id
      title
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($title: String!) {
    addTodo(title: $title) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $completed: Boolean!) {
    updateTodo(id: $id, completed: $completed) {
      id
      title
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
      title
      completed
    }
  }
`;

type Todo = {
  id: string;
  title: string;
  completed: boolean;
}

const { Title, Text } = Typography;

export default function Home() {

  const { loading, data } = useQuery<{ getTodos: Todo[] }>(GET_TODOS, {
    fetchPolicy: "network-only",
  });
  const todos = data ? data.getTodos : [];

  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [title, setTitle] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [api, contextHolder] = useNotification();
  const openNotificationWithIcon = useCallback((type: Exclude<keyof typeof api, "destroy">) => {
    api[type]({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
  }, [api]);

  const handleAddTodo = useCallback(async () => {
    await addTodo({
      variables: { title },
      refetchQueries: [{ query: GET_TODOS }],
    });
    setTitle("");
    openNotificationWithIcon("success");
  }, [addTodo, openNotificationWithIcon, title]);

  const handleUpdateTodo = useCallback(async (target: Todo) => {
    const completed = !target.completed
    await updateTodo({
      variables: { id: target.id, completed },
      refetchQueries: [{ query: GET_TODOS }],
    });

    // OFFにした場合はタイマーリセット
    if (!completed) { return timer.current = null }

    await new Promise(resolve => timer.current = setTimeout(resolve, 2000))
    // 制限時間内にタイマーがリセットしていたら削除しない
    if (!timer.current) return
    await deleteTodo({
      variables: { id: target.id },
      refetchQueries: [{ query: GET_TODOS }],
    })
  }, [deleteTodo, updateTodo]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Todoアプリ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='App-header' style={{ backgroundColor: '#a9d8fc' }}>
        <Row align='middle' style={{ height: '50px' }}>
          <Col offset={1} span={5}>
            <Title
              level={3}
              style={{
                color: 'black',
                marginBottom: '0',
                paddingRight: '5px',
              }}
            >
              TODOアプリ
            </Title>
          </Col>
          <Col span={10} style={{ paddingLeft: '10px' }}>
            <Space.Compact block>
              <Input
                placeholder='TODOを追加してください'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Button type="primary" onClick={handleAddTodo}>追加</Button>
            </Space.Compact>
          </Col>
          <Col
            span={3}
            offset={5}
            style={{
              color: 'white',
              alignItems: 'center',
            }}
          >
            <Badge count={5} offset={[-15, 15]}>
              <BellFilled
                style={{ fontSize: '18px', padding: '15px', color: 'white' }}
              />
            </Badge>
            <Avatar
              shape='circle'
              style={{ backgroundColor: 'gray' }}
              icon={<UserOutlined />}
            />
          </Col>
        </Row>
      </header>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <div>
            {contextHolder}
            <Text strong style={{ fontSize: 30, color: 'black' }}>
              TO DO List
            </Text>
            <List
              itemLayout="horizontal"
              dataSource={todos}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={(
                      <>
                        <Checkbox
                          checked={item.completed}
                          onChange={() => handleUpdateTodo(item)}
                          style={{ marginRight: 10 }}
                        />
                        {item.title}
                      </>
                    )}
                    style={{ textDecoration: item.completed ? "line-through" : "none", }}
                  />
                </List.Item>
              )}
            />
          </div>
        </main>
      </div>
    </>
  );
}
