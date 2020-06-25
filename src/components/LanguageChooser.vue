<template>
  <b-dropdown
    id="change-locale"
    dropup
    :text="language"
    variant="outline-light"
    class="m-2"
    size="lg"
  >
    <b-dropdown-item
      v-for="locale in locales"
      href="#"
      v-bind:key="locale"
      class="text-uppercase"
      @click="onChangeLocale(locale)"
    >
      {{ $t(`languages.${locale}`) }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class LanguageChoser extends Vue {
  public get locales(): Array<string> {
    return ["en", "et", "fi", "gr", "it"];
  }

  public get language(): string {
    const locale = this.$i18n.locale;
    return this.$t(`languages.${locale}`).toString();
  }

  onChangeLocale(locale: string): void {
    this.$root.$i18n.locale = locale;
    this.$root.$emit("localeChanged", locale);
  }
}
</script>

<i18n>
{
  "en": {
    "languages": {
      "en": "English",
      "et": "Estonian",
      "fi": "Finnish",
      "gr": "Greek",
      "it": "Italian"
    }
  },
  "et": {
    "languages": {
      "en": "Inglise",
      "et": "Eesti",
      "fi": "Soome",
      "gr": "Kreeka",
      "it": "Itaalia"
    }
  }
}
</i18n>
