import styles from "@/styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";

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

export default function Home() {

  const { loading, data } = useQuery<{ getTodos: Todo[] }>(GET_TODOS, {
    fetchPolicy: "network-only",
  });
  const todos = data ? data.getTodos : [];

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
            <input type="text" placeholder="TODOを追加してください" />
            <button>追加</button>
            <ul>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  <input type="checkbox" checked={todo.completed} />
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
