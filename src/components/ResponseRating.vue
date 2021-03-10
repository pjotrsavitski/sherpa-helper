<template>
  <div class="d-flex flex-row-reverse align-items-center">
    <b-button-group size="sm" class="mt-1">
      <b-button
        v-for="(option, index) in ratingOptions"
        v-bind:key="index"
        :variant="ratingButtonVariant(option.rating)"
        @click="onSubmitRating(option.rating)"
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

@Component
export default class ResponeRating extends Vue {
  ratingOptions = [
    {
      rating: 1,
      iconClass: "far fa-smile"
    },
    {
      rating: 2,
      iconClass: "far fa-meh"
    },
    {
      rating: 3,
      iconClass: "far fa-frown"
    }
  ];
  loading = false;
  responseRated = false;
  rating = 0;

  @Prop({ required: true })
  item!: ConversationEntry;

  ratingButtonVariant(rating: number): string {
    return this.rating === rating ? "secondary" : "outline-secondary";
  }

  onSubmitRating(rating: number): void {
    this.rating = rating;
    this.loading = true;

    knowledgeBaseService
      .submitResponeRating(
        this.item.userInput,
        this.item.text,
        this.item.locale,
        rating
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
