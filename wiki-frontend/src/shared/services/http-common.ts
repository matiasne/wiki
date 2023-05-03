"use client";

import { BaseURL } from "@/config/variables";
import axios from "axios";

let httpClient = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-type": "application/json",
  },
});

httpClient.interceptors.request.use(async (request) => {
  request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return request;
});

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const code = error.response.status;

    if (code === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return error;
  }
);

export default httpClient;
