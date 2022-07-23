<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar
        :class="configurationStore.isDarkMode ? 'dark-primary' : 'primary'"
      >
        <div class="lt-md">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
        </div>

        <div class="gt-sm">
          <q-btn flat icon="schedule" :label="t('time_keeper')" to="/" />
          <q-btn
            flat
            icon="calculate"
            :label="t('time_calculator')"
            to="/timecalculator"
          />
          <q-btn
            flat
            icon="build"
            :label="t('configuration')"
            to="/configuration"
          />
        </div>

        <div class="absolute-right">
          <q-btn
            flat
            :icon="configurationStore.isDarkMode ? 'dark_mode' : 'o_dark_mode'"
            @click="toggleMode"
          />
          <language-dropdown></language-dropdown>
          <q-toggle
            color="secondary"
            v-model="isAutoSave"
            checked-icon="save"
            unchecked-icon="clear"
            size="lg"
          >
            <q-tooltip class="tooltip">
              {{ isAutoSave ? t("auto_save_on") : t("auto_save_off") }}
            </q-tooltip>
          </q-toggle>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered :width="200">
      <q-list padding>
        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="schedule" size="25px" />
          </q-item-section>
          <q-item-section>{{ t("time_keeper") }}</q-item-section>
        </q-item>

        <q-item clickable to="/timecalculator">
          <q-item-section avatar>
            <q-icon name="calculate" size="25px" />
          </q-item-section>
          <q-item-section>{{ t("time_calculator") }}</q-item-section>
        </q-item>

        <q-item clickable to="/configuration">
          <q-item-section avatar>
            <q-icon name="build" size="25px" />
          </q-item-section>
          <q-item-section>{{ t("configuration") }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div>
        <router-view />
      </div>
      <popup></popup>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { IConfigurationStore } from "@/models/store-model";
import { IData } from "@/models/month-model";
import { storeToRefs } from "pinia";

import { handleAutoSave } from "@/utils/auto-save-handler";

import { createDataFolder, readFile } from "@/utils/fs-handler";
import useConfigurationStore from "@/stores/useConfigurationStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";

import Popup from "@/components/Popup.vue";
import LanguageDropdown from "@/components/LanguageDropdown.vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";

const leftDrawerOpen = ref(false);

const configurationStore = useConfigurationStore();
const { isAutoSave } = storeToRefs(configurationStore);

const timekeeperStore = useTimekeepingStore();

const q = useQuasar();

const toggleMode = () => {
  q.dark.toggle();
  configurationStore.isDarkMode = q.dark.isActive;
};

const { t } = useI18n();

const localeI18n = useI18n().locale;

console.log(import.meta.env.VITE_APP_MODE);
// if (import.meta.env.VITE_APP_MODE === "tauri") {
// create data dir
await createDataFolder();

const config = (await readFile("configuration.json")) as IConfigurationStore;
// check for existing config file
if (config) {
  console.debug("Loaded configuration.json successfully");
  const {
    yearlyVacationDays,
    weeklyHoursWorking,
    isAutoSave,
    autoSaveTimeSeconds,
    isDarkMode,
    locale,
    country,
    state,
  } = config;

  configurationStore.yearlyVacationDays = yearlyVacationDays
    ? yearlyVacationDays
    : configurationStore.yearlyVacationDays;

  configurationStore.weeklyHoursWorking = weeklyHoursWorking
    ? weeklyHoursWorking
    : configurationStore.weeklyHoursWorking;

  configurationStore.isAutoSave = isAutoSave
    ? isAutoSave
    : configurationStore.isAutoSave;

  configurationStore.autoSaveTimeSeconds = autoSaveTimeSeconds
    ? autoSaveTimeSeconds
    : configurationStore.autoSaveTimeSeconds;

  configurationStore.isDarkMode = isDarkMode
    ? isDarkMode
    : configurationStore.isDarkMode;

  if (configurationStore.isDarkMode) q.dark.toggle();

  configurationStore.locale = locale ? locale : configurationStore.locale;
  localeI18n.value = configurationStore.locale;

  configurationStore.country = country ? country : configurationStore.country;
  configurationStore.state = state ? state : configurationStore.state;
}

const dataFile = (await readFile("data.json")) as IData;
if (dataFile) {
  console.debug("Loaded data.json successfully");
  timekeeperStore.data = dataFile;
}

if (configurationStore.isAutoSave === true) handleAutoSave(t);

watch(isAutoSave, (_newIsAutoSave) => {
  handleAutoSave(t);
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
<style lang="scss">
.tooltip {
  font-size: 14px;
}
</style>
