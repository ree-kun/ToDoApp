import styles from "@/styles/Home.module.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import { useCallback, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const GET_TODOS = gql`
  query {
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

export default function Home() {

  const { loading, data } = useQuery<{ getTodos: Todo[] }>(GET_TODOS, {
    fetchPolicy: "network-only",
  });
  const todos = data ? data.getTodos : [];

  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [title, setTitle] = useState("");

  const handleAddTodo = useCallback(async () => {
    await addTodo({
      variables: { title },
      refetchQueries: [{ query: GET_TODOS }],
    });
    setTitle("");
  }, [title]);

  const handleUpdateTodo = useCallback(async (target: Todo) => {
    console.log(target)
    await updateTodo({
      variables: { id: target.id, completed: !target.completed },
      refetchQueries: [{ query: GET_TODOS }],
    });
  }, []);

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
        </main>
      </div>
    </>
  );
}
