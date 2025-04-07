import styles from "@/styles/Home.module.css";
import { gql, useMutation, useQuery } from "@apollo/client";
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

  const handleAddTodo = useCallback(async () => {
    await addTodo({
      variables: { title },
      refetchQueries: [{ query: GET_TODOS }],
    });
    setTitle("");
  }, [addTodo, title]);

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
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <div>
            <h1>TO DO List</h1>
            <input
              type="text"
              placeholder="TODOを追加してください"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={handleAddTodo}>追加</button>
            <ul>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  <input type="checkbox" checked={todo.completed} onChange={() => handleUpdateTodo(todo)} />
                  {todo.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="App bg-blue-500 text-white p-6">
            <h1 className="text-3xl font-bold">Hello, Tailwind CSS!</h1>
            <p className="mt-4">Welcome to your React project with Tailwind CSS!</p>
          </div>
        </main>
      </div>
    </>
  );
}
