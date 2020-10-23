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

const meta = document.querySelector(
  'meta[name="chatbot-url"]'
) as HTMLMetaElement;

// A singleton instance
export const chatBotService = new ChatBotService(meta.content);
