import axios, { AxiosInstance } from "axios";

export default class ChatBotService {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({
      baseURL: baseUrl
    });
  }

  getAnswer(question: string, languageCode: string) {
    return this.http.post(
      "/chatterbot/applyQuestion",
      {
        text: question,
        languageCode: languageCode
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
  "http://83.212.93.155:5000"
);
