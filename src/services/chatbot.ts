import http from "./http";

export default class ChatBotService {
  getAnswer(question: string) {
    return http.post(
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
export const chatBotService = new ChatBotService();
