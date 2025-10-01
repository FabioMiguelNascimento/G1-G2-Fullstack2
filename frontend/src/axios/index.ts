import axios from "axios";

export const api = axios.create({
  baseURL: "https://",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});
