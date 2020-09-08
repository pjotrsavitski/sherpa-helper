<template>
  <div class="container main my-4">
    <div class="row">
      <div class="col-sm info p-4">
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
          <language-chooser :locales="locales"></language-chooser>
        </div>
      </div>
      <div class="col-sm chat px-0">
        <div class="conversation p-2 px-4 mt-4">
          <conversation-item
            v-for="(item, index) in conversation"
            v-bind:key="index"
            :item="item"
          ></conversation-item>
          <b-spinner
            label="Loading..."
            type="grow"
            variant="secondary"
            small
            v-if="loading"
          ></b-spinner>
        </div>
        <div class="container position-absolute question" ref="question">
          <div class="row">
            <div class="col">
              <b-form @submit="onSubmitQuestion">
                <b-input-group>
                  <b-form-input
                    v-model="question"
                    v-bind:placeholder="$t('conversation.question_placeholder')"
                    v-bind:disabled="loading"
                    size="lg"
                    trim
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
import { chatBotService } from "../services/chatbot";
import ConversationItem from "./ConversationItem.vue";
import LanguageChooser from "./LanguageChooser.vue";

@Component({
  components: {
    ConversationItem,
    LanguageChooser
  },
  props: {
    locales: {
      type: Array,
      required: true
    }
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

    if (this.question.length <= 0) {
      return;
    }

    this.askQuestion(this.question).then(() => {
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

        if (answer) {
          this.addToConversation("chatbot", answer);
        } else {
          this.addToConversation("suggestion", question);
        }
      })
      .catch(error => {
        this.loading = false;
        window.console.error(error);
        this.$bvToast.toast(error.message, {
          toaster: "b-toaster-bottom-left",
          title: this.$t("conversation.api_error_toast.title").toString(),
          variant: "danger"
        });
      })
      .then(() => {
        Vue.nextTick(() => {
          this.questionElement.scrollIntoView({
            behavior: "smooth",
            block: "end"
          });
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
      toaster: "b-toaster-bottom-left",
      title: "NB!",
      variant: "warning"
    });
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
    background-color: rgb(80, 181, 187);
    text-align: left;
    color: rgb(255, 255, 255);
    font-weight: 500;
    font-size: 125%;

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
      "api_error_toast": {
        "title": "Error!"
      },
      "question_placeholder": "Type your question here"
    }
  },
  "et": {
    "info": {
      "header": "Tere! Olen SELFIE CHATBOT, kuidas saan abiks olla?",
      "popular_questions": "Siin on mõned populaarsed küsimused:",
      "see_more_questions": "Rohkem küsimusi"
    },
    "conversation": {
      "greeting": "Tere! Kuidas saan abiks olla?",
      "api_error_toast": {
        "title": "Viga!"
      },
      "question_placeholder": "Trüki oma küsimus siia"
    }
  }
}
</i18n>
