<template>
  <q-btn-dropdown flat :label="locale" class="change_history">
    <q-list>
      <q-item
        v-for="loc in localeOptions"
        clickable
        v-close-popup
        @click="changeLanguage(loc.lang)"
      >
        <q-item-section>
          <span :class="loc.flag" style="height: 15px; width: 20px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-pt-xs">{{ loc.lang }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const changeLanguage = (selected: string) => {
  locale.value = selected;
};

const localeOptions = [
  {
    lang: "de",
    flag: "fi fi-de",
  },
  {
    lang: "en",
    flag: "fi fi-us",
  },
];
</script>
<style scoped lang="scss"></style>
