import styles from "@/styles/Home.module.css";
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

export default function Home() {

  const todos = [
    { id: "1", title: "GraphQLを学ぶ", completed: false },
    { id: "2", title: "Reactを学ぶ", completed: true },
  ] as Todo[];

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
                  <input type="checkbox" checked={todo.completed}  />
                  {todo.title}
            </li>
              ))}
            </ul>
          </div>`


        </main>
      </div>
    </>
  );
}
