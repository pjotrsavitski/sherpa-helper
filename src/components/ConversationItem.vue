<template>
  <div
    v-bind:class="{
      user: isUser(),
      chatbot: isChatBot(),
      'my-2 row conversation-item': true
    }"
  >
    <div class="col">
      <i
        class="fas fa-robot fa-2x"
        v-if="isChatBot()"
        v-b-tooltip.hover
        v-bind:title="localDate"
      ></i>
    </div>
    <div class="col-8">
      <span class="text" v-if="isGreeting()">
        {{ $t("greeting") }}
      </span>
      <span
        class="text"
        v-html="htmlifyText(item.text)"
        v-if="!(isSuggestion() || isGreeting())"
      ></span>
      <div v-if="isSuggestion()">
        <span class="text">
          {{ $t("suggestion.text") }}
        </span>
        <div class="my-2 text-center">
          <b-button-group>
            <b-button
              size="sm"
              variant="outline-secondary"
              :disabled="loading || disableSuggestion"
              @click="onYes"
            >
              <b-spinner
                label="Loading..."
                type="grow"
                variant="secondary"
                small
                v-if="loading"
              ></b-spinner>
              Yes
            </b-button>
            <b-button
              size="sm"
              variant="outline-secondary"
              :disabled="loading || disableSuggestion"
              @click="onNo"
            >
              No
            </b-button>
          </b-button-group>
        </div>
        <span class="text" v-if="congratulate">
          {{ $t("suggestion.congrats") }}
        </span>
      </div>
    </div>
    <div class="col">
      <i
        class="fas fa-user-circle fa-2x"
        v-if="isUser()"
        v-b-tooltip.hover
        v-bind:title="localDate"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import urlRegex from "url-regex";
import { ConversationEntry } from "../store";
import { knowledgeBaseService } from "../services/kb";
import { recaptchaService } from "../services/recaptcha";

@Component
export default class ConversationItem extends Vue {
  loading = false;
  disableSuggestion = false;
  congratulate = false;

  @Prop({ required: true })
  item!: ConversationEntry;

  mounted() {
    // TODO See if this is the best solution or could be improved upon
    recaptchaService.load();
  }

  get localDate(): string {
    return this.item.timestamp.toLocaleString();
  }

  isChatBot(): boolean {
    return ["chatbot", "suggestion", "greeting"].includes(this.item.type);
  }

  isUser(): boolean {
    return this.item.type === "user";
  }

  isSuggestion(): boolean {
    return this.item.type === "suggestion";
  }

  isGreeting(): boolean {
    return this.item.type === "greeting";
  }

  htmlifyText(value: string): string {
    let processed = value;
    processed = processed.replace(/\\n/g, "<br>");
    processed = processed.replace(urlRegex(), url => {
      if (url.endsWith(",") || url.endsWith(".")) {
        const ending = url.charAt(url.length - 1);
        url = url.slice(0, -1);
        return `<a href="${url}" target="_blank">${url}</a>${ending}`;
      }

      return `<a href="${url}" target="_blank">${url}</a>`;
    });

    return processed;
  }

  makeSuggestion(suggestion: string): void {
    this.loading = true;

    recaptchaService.execute("suggest").then(token => {
      knowledgeBaseService
        .postSuggestion(suggestion, this.$i18n.locale, token)
        .then(() => {
          this.loading = false;
          this.disableSuggestion = true;
          this.congratulate = true;
        })
        .catch(error => {
          this.loading = false;
          window.console.error(error);
          this.$bvToast.toast(error.message, {
            toaster: "b-toaster-bottom-left",
            title: this.$t("toast.error.title").toString(),
            variant: "danger"
          });
        });
    });
  }

  onYes(): void {
    this.makeSuggestion(this.item.text);
  }

  onNo(): void {
    this.disableSuggestion = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.conversation-item {
  &.chatbot {
    text-align: left;
  }

  &.user {
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
</style>

<i18n>
{
  "en": {
    "greeting": "Hello! How can I help you?",
    "suggestion": {
      "text": "I’m unable to find an answer to your question. Would you like to suggest this question to my database?",
      "congrats": "Great! Do you have any further questions?"
    }
  },
  "et": {
    "greeting": "Tere! Kuidas saan abiks olla?",
    "suggestion": {
      "text": "Ma ei leia kahjuks vastust Sinu küsimusele. Kas Sa sooviksid selle küsimuse andmebaasi lisada?",
      "congrats": "Tore! Kas Sul on veel küsimusi?"
    }
  },
  "fi": {
    "greeting": "Hei! Kuinka voin auttaa ?",
    "suggestion": {
      "text": "En valitettavasti löydä vastausta kysymykseesi. Haluatko että tämä kysymys siirretään tietokantaani vastattavaksi ?",
      "congrats": "Hienoa!, Onko sinulla lisää kysymyksiä ?"
    }
  },
  "it": {
    "greeting": "Ciao! Come posso auitarti?",
    "suggestion": {
      "text": "Non trovo una risposta alla tua domanda. Vuoi che questa domanda venga sottoposta alla mia banca dati?",
      "congrats": "Grande! Hai altre domande?"
    }
  }
}
</i18n>
