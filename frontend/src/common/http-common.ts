import axios from "axios";

let client = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

client.interceptors.response.use(
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

export default client;
