import axios from "axios";

export default axios.create({
  baseURL: "https://chatbot.smartzoos.eu",
  params: {
    // API params go here
  }
});
