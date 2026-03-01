"use client";

import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
} from "@apollo/client/core";
import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { ReactNode } from "react";

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: ReactNode }) {
    return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
