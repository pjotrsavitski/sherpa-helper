<template>
  <div class="container main my-4">
    <div class="row">
      <div class="col-sm info">
        <div class="header my-4">
          {{ $t("info.header") }}
        </div>
        <div class="mt-4">
          <strong>{{ $t("info.popular_questions") }}</strong>
          <ul class="popular-questions pl-0">
            <li
              v-for="(question, index) in popularQuestions"
              v-bind:key="index"
              class="mt-1"
            >
              <span @click="onAskPopularQuestion(question)">
                {{ question }}
              </span>
            </li>
          </ul>

          <div @click="onMoreQuestions" class="more-questions mt-4">
            {{ $t("info.see_more_questions") }}
          </div>
        </div>

        <div class="language-chooser-wrapper">
          <language-chooser></language-chooser>
        </div>
      </div>
      <div class="col-sm chat px-0">
        <div class="conversation p-2 px-4 mt-4">
          <div
            v-for="(item, index) in conversation"
            v-bind:key="index"
            v-bind:class="{
              user: item.type === 'user',
              chatbot: item.type === 'chatbot',
              'my-2 row': true
            }"
          >
            <div class="col">
              <i
                class="fas fa-robot fa-2x"
                v-if="item.type === 'chatbot'"
                v-b-tooltip.hover
                v-bind:title="item.timestamp.toLocaleString()"
              ></i>
            </div>
            <div class="col-8">
              <span class="text" v-html="htmlifyText(item.text)"></span>
            </div>
            <div class="col">
              <i
                class="fas fa-user-circle fa-2x"
                v-if="item.type === 'user'"
                v-b-tooltip.hover
                v-bind:title="item.timestamp.toLocaleString()"
              ></i>
            </div>
          </div>
          <i class="fas fa-spinner fa-pulse fa-2x" v-if="loading"></i>
        </div>
        <div class="container position-absolute question" ref="question">
          <div class="row">
            <div class="col">
              <b-form @submit="onSubmitQuestion">
                <b-input-group>
                  <b-form-input
                    v-model="question"
                    placeholder="Type your question here"
                    v-bind:disabled="loading"
                    size="lg"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      variant="outline-secondary"
                      type="submit"
                      v-bind:disabled="loading"
                    >
                      <i class="fas fa-paper-plane fa-lg"></i>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChatBotService from "../services/chatbot";
import urlRegex from "url-regex";
import LanguageChooser from "./LanguageChooser.vue";

const chatBotService = new ChatBotService();

@Component({
  components: {
    LanguageChooser
  }
})
export default class ChatBot extends Vue {
  loading = false;
  question = "";

  mounted() {
    // TODO Those should be loaded from an API
    this.$store.dispatch("setPopularQuestions", [
      "How do I register for SELFIE?",
      "How do I login?",
      "How do I navigate within SELFIE?",
      "How do I set SELFIE up for my school?",
      "How do I choose who will take part in SELFIE?"
    ]);
    // TODO Consider showing this one all the time, making it possible to be
    // translated when language is changed.
    this.addToConversation(
      "chatbot",
      this.$t("conversation.greeting").toString()
    );
  }

  public get conversation(): Array<{ type: string; text: string }>[] {
    return this.$store.state.conversation;
  }

  public get popularQuestions(): Array<string>[] {
    return this.$store.state.popularQuestions;
  }

  private get questionElement(): HTMLElement {
    return this.$refs.question as HTMLElement;
  }

  private addToConversation(type: string, text: string): void {
    this.$store.dispatch("addToConversation", {
      type: type,
      text: text,
      timestamp: new Date()
    });
  }

  onSubmitQuestion(evt: Event): void {
    evt.preventDefault();

    if (this.question.trim().length <= 0) {
      return;
    }

    this.askQuestion(this.question.trim()).then(() => {
      this.question = "";
    });
  }

  onAskPopularQuestion(question: string): void {
    if (!this.loading) {
      this.askQuestion(question);
    }
  }

  askQuestion(question: string): Promise<void> {
    this.loading = true;

    this.addToConversation("user", question);

    return chatBotService
      .getAnswer(question)
      .then(response => {
        this.loading = false;
        const answer = this.extractChatBotAnswer(response.data);

        this.addToConversation(
          "chatbot",
          answer
            ? answer
            : this.$t(
                "conversation.answer_not_found_add_to_database"
              ).toString()
        );
      })
      .catch(error => {
        this.loading = false;
        window.console.error(error);
        this.$bvToast.toast(error.message, {
          title: this.$t("conversation.api_error_toast.title").toString(),
          variant: "danger"
        });
      })
      .then(() => {
        Vue.nextTick(() => {
          this.questionElement.scrollIntoView(false);
        });
      });
  }

  extractChatBotAnswer(responses: [string, string, number][]): string | null {
    if (!(responses.length > 0)) return null;

    if (responses.length === 1) return responses[0][1];

    return responses.sort((a, b) => {
      return b[2] - a[2];
    })[0][1];
  }

  onMoreQuestions(): void {
    this.$bvToast.toast("This feature has not been implemented yet!", {
      title: "NB!",
      variant: "warning"
    });
  }

  htmlifyText(value: string): string {
    let processed = value;
    processed = processed.replace(/\\n/g, "<br>");
    processed = processed.replace(urlRegex(), url => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });

    return processed;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container.main {
  > .row {
    min-height: 75vh;
  }

  .info {
    background-color: #51b7bc;
    text-align: left;

    .header {
      font-size: 150%;
    }

    .popular-questions {
      list-style-type: none;

      li > span {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .more-questions {
      text-decoration: underline;
      cursor: pointer;
    }

    .language-chooser-wrapper {
      position: absolute;
      bottom: 0.5em;
      right: 0.5em;
    }
  }

  .chat {
    background-color: rgba(245, 245, 245, 1);

    .conversation {
      margin-bottom: 5em;

      .chatbot {
        text-align: left;
      }

      .user {
        text-align: right;

        .text {
          background-color: rgba(64, 75, 182, 1);
          color: #fff;
          border-radius: 1em;
          padding: 0.5em;
          border-bottom-right-radius: 0;
          display: inline-block;
          word-wrap: break-word;
        }
      }

      .fa-robot {
        color: #8cc152;
      }

      .fa-user-circle {
        color: #d770ad;
      }
    }

    .container.question {
      bottom: 1em;
    }
  }
}
</style>

<i18n>
{
  "en": {
    "info": {
      "header": "Hello! I am the SELFIE CHATBOT, how can I help you?",
      "popular_questions": "Here are some most popular questions to start with:",
      "see_more_questions": "See more common questions"
    },
    "conversation": {
      "greeting": "Hello! How can I help you?",
      "answer_not_found_add_to_database": "I’m not able to find an answer to your question. Would you like to suggest this question to my database?",
      "api_error_toast": {
        "title": "Error!"
      }
    }
  }
}
</i18n>
