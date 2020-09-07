import axios, { AxiosInstance } from "axios";

export default class KnowledgeBaseService {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({
      baseURL: baseUrl
    });
  }

  postSuggestion(question: string, language: string) {
    return this.http.post(
      "/api/question",
      {
        question: question,
        language: language
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
export const knowledgeBaseService = new KnowledgeBaseService(
  "https://kb.smartzoos.eu"
);
