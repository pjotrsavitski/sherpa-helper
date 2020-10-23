import axios, { AxiosInstance } from "axios";

export default class KnowledgeBaseService {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({
      baseURL: baseUrl
    });
  }

  postSuggestion(question: string, language: string, token: string) {
    return this.http.post(
      "/api/question",
      {
        question: question,
        language: language,
        token: token
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
  'meta[name="kb-url"]'
) as HTMLMetaElement;

// A singleton instance
export const knowledgeBaseService = new KnowledgeBaseService(meta.content);
