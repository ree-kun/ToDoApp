import "@/styles/globals.css";
import "@/styles/tailwind.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

export type State = { title: string }
const INITIAL_STATE: State = { title: "" }

const titleSlice = createSlice({
  name: 'title',
  initialState: INITIAL_STATE,
  reducers: {
    titleUpdate: (state, action) => {
      state.title = action.payload
    },
  },
})

export const { titleUpdate } = titleSlice.actions

const store = configureStore({
  reducer: titleSlice.reducer
})
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  );
}
