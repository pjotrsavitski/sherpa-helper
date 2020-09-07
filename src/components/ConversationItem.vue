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
      <span
        class="text"
        v-html="htmlifyText(item.text)"
        v-if="!isSuggestion()"
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

@Component
export default class ConversationItem extends Vue {
  loading = false;
  disableSuggestion = false;
  congratulate = false;

  @Prop({ required: true })
  item!: ConversationEntry;

  get localDate(): string {
    return this.item.timestamp.toLocaleString();
  }

  isChatBot(): boolean {
    return this.item.type === "chatbot" || this.item.type === "suggestion";
  }

  isUser(): boolean {
    return this.item.type === "user";
  }

  isSuggestion(): boolean {
    return this.item.type === "suggestion";
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

  makeSuggestion(suggestion: string): Promise<void> {
    this.loading = true;

    return knowledgeBaseService
      .postSuggestion(suggestion, this.$i18n.locale)
      .then(response => {
        this.loading = false;
        this.disableSuggestion = true;
        this.congratulate = true;
      })
      .catch(error => {
        this.loading = false;
        window.console.error(error);
        this.$bvToast.toast(error.message, {
          toaster: "b-toaster-bottom-left",
          title: this.$t("conversation.api_error_toast.title").toString(),
          variant: "danger"
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
    "suggestion": {
      "text": "I’m not able to find an answer to your question. Would you like to suggest this question to my database?",
      "congrats": "Great! Do you have any further questions?"
    }
  }
}
</i18n>
