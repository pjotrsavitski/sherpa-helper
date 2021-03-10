import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export interface ConversationEntry {
  type: string;
  text: string;
  timestamp: Date;
  locale: string;
  userInput: string;
}

export default new Vuex.Store({
  state: {
    conversation: Array<ConversationEntry>(),
    popularQuestions: Array<string>()
  },
  mutations: {
    addToConversation(state, entry: ConversationEntry) {
      state.conversation.push(entry);
    },
    addToPopularQuestions(state, question: string) {
      state.popularQuestions.push(question);
    },
    setPopularQuestions(state, questions: Array<string>) {
      state.popularQuestions = questions;
    },
    clearConversation(state) {
      state.conversation.splice(1);
    }
  },
  actions: {
    addToConversation(context, entry: ConversationEntry) {
      context.commit("addToConversation", entry);
    },
    addToPopularQuestions(context, question: string) {
      context.commit("addToPopularQuestions", question);
    },
    setPopularQuestions(context, questions: Array<string>) {
      context.commit("setPopularQuestions", questions);
    },
    clearConversation(context) {
      context.commit("clearConversation");
    }
  },
  modules: {}
});
