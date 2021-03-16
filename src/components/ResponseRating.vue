<template>
  <div class="d-flex flex-row-reverse align-items-center">
    <b-button-group size="sm" class="mt-1">
      <b-button
        v-for="(option, index) in ratingOptions"
        v-bind:key="index"
        :variant="ratingButtonVariant(option)"
        @click="onSubmitRating(option)"
        :disabled="loading || responseRated"
      >
        <i :class="option.iconClass"></i>
      </b-button>
    </b-button-group>

    <div v-if="loading">
      <b-spinner
        label="Loading..."
        type="grow"
        variant="secondary"
        small
      ></b-spinner>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ConversationEntry } from "../store";
import { knowledgeBaseService } from "../services/kb";

interface RatingOption {
  value: number;
  iconClass: string;
  buttonVariant: string;
}

@Component
export default class ResponseRating extends Vue {
  ratingOptions: Array<RatingOption> = [
    {
      value: 1,
      iconClass: "far fa-frown text-danger",
      buttonVariant: "secondary"
    },
    {
      value: 2,
      iconClass: "far fa-meh",
      buttonVariant: "secondary"
    },
    {
      value: 3,
      iconClass: "far fa-smile text-success",
      buttonVariant: "secondary"
    }
  ];
  loading = false;
  responseRated = false;
  rating = 0;

  @Prop({ required: true })
  item!: ConversationEntry;

  ratingButtonVariant(option: RatingOption): string {
    return this.rating === option.value
      ? option.buttonVariant
      : `outline-${option.buttonVariant}`;
  }

  onSubmitRating(option: RatingOption): void {
    this.rating = option.value;
    this.loading = true;

    knowledgeBaseService
      .submitResponeRating(
        this.item.userInput,
        this.item.text,
        this.item.locale,
        option.value
      )
      .then(() => {
        this.responseRated = true;
        this.loading = false;
      })
      .catch(error => {
        this.rating = 0;
        this.loading = false;
        window.console.error(error);
        this.$bvToast.toast(error.message, {
          toaster: "b-toaster-bottom-left",
          title: this.$t("toast.error.title").toString(),
          variant: "danger"
        });
      });
  }
}
</script>
