<template>
  <q-btn-dropdown flat>
    <template v-slot:label>
      <div class="row items-center no-wrap">
        <span :class="selected" />
      </div>
    </template>
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
import useConfigurationStore from "@/stores/useConfigurationStore";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const configurationStore = useConfigurationStore();
const { locale } = useI18n();

const changeLanguage = (newSelected: string) => {
  locale.value = newSelected;
  configurationStore.locale = newSelected;
  const selectedOption = localeOptions.find(
    (element) => element.lang === newSelected
  );
  selected.value = selectedOption ? selectedOption.flag : localeOptions[0].flag;
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

const selected = ref<string>(localeOptions[0].flag);
</script>
<style lang="scss">
.q-btn-dropdown--simple * + .q-btn-dropdown__arrow {
  display: none;
}
</style>
