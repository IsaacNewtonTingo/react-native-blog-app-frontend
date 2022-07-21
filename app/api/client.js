import axios from "axios";

const client = axios.create({
  baseURL: "https://blogappfull.herokuapp.com/api",
});

export default client;
