import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7014/api", // Your .NET API URL
  headers: { "Content-Type": "application/json" },
});

export default API;
