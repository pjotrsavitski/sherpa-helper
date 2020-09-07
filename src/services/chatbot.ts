import axios, { AxiosInstance } from "axios";

export default class ChatBotService {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({
      baseURL: baseUrl
    });
  }

  getAnswer(question: string) {
    return this.http.post(
      "sherpa.php",
      {
        question: question
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }
      }
    );
  }
}

// A singleton instance
export const chatBotService = new ChatBotService(
  "https://chatbot.smartzoos.eu"
);
