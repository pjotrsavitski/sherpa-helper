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

  logActivity(question: string, answer: string, languageCode: string) {
    return this.http.post(
      "/api/helper_activity",
      {
        question: question,
        answer: answer,
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

  submitResponeRating(
    question: string,
    answer: string,
    languageCode: string,
    rating: number
  ) {
    return this.http.post(
      "/api/helper_response_user_ratings",
      {
        question: question,
        answer: answer,
        languageCode: languageCode,
        rating: rating
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

const meta = document.querySelector('meta[name="kb-url"]') as HTMLMetaElement;

// A singleton instance
export const knowledgeBaseService = new KnowledgeBaseService(meta.content);
