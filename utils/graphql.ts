import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUBSQUID_URL,
});

export const graphqlClient =
  <TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: RequestInit["headers"]
  ) =>
  async () => {
    const res = await axiosInstance<TData>({
      url: "/graphql",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
      data: { query, variables },
    });

    return res.data["data"];
  };
