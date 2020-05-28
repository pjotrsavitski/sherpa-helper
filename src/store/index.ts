import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

interface ConversationEntry {
  type: string;
  text: string;
  timestamp: Date;
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
    }
  },
  modules: {}
});
