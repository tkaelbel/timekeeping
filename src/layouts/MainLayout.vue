<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar
        :class="configurationStore.isDarkMode ? 'dark-primary' : 'primary'"
      >
        <div>
          <q-btn flat icon="img:/favicon.ico" size="xl"></q-btn>
        </div>
        <q-space />

        <div>
          <q-btn
            flat
            :icon="configurationStore.isDarkMode ? 'dark_mode' : 'o_dark_mode'"
            @click="toggleMode"
          />
          <language-dropdown></language-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :width="200"
      :breakpoint="500"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-list padding>
        <q-item
          to="/"
          @click="selectMenuItem = 'time_keeper'"
          :active="selectMenuItem === 'time_keeper'"
          :class="
            selectMenuItem === 'time_keeper' && configurationStore.isDarkMode
              ? 'blue-grey-color'
              : 'primary'
          "
        >
          <q-item-section avatar>
            <q-icon name="schedule" size="25px" />
          </q-item-section>
          <q-item-section>{{ t("time_keeper") }}</q-item-section>
        </q-item>

        <q-item
          to="/timecalculator"
          @click="selectMenuItem = 'time_calculator'"
          :active="selectMenuItem === 'time_calculator'"
          :class="
            selectMenuItem === 'time_calculator' &&
            configurationStore.isDarkMode
              ? 'blue-grey-color'
              : 'primary'
          "
        >
          <q-item-section avatar>
            <q-icon name="calculate" size="25px" />
          </q-item-section>
          <q-item-section>{{ t("time_calculator") }}</q-item-section>
        </q-item>

        <q-item
          to="/data"
          @click="selectMenuItem = 'data'"
          :active="selectMenuItem === 'data'"
          :class="
            selectMenuItem === 'data' && configurationStore.isDarkMode
              ? 'blue-grey-color'
              : 'primary'
          "
        >
          <q-item-section avatar>
            <q-icon name="folder" size="25px" />
          </q-item-section>
          <q-item-section>{{ t("data") }}</q-item-section>
        </q-item>

        <q-item
          to="/configuration"
          @click="selectMenuItem = 'configuration'"
          :active="selectMenuItem === 'configuration'"
          :class="
            selectMenuItem === 'configuration' && configurationStore.isDarkMode
              ? 'blue-grey-color'
              : 'primary'
          "
        >
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
import { ref } from "vue";

import { IConfigurationStore } from "@/models/store-model";
import { IData } from "@/models/month-model";
import { createDataFolder, readFile } from "@/utils/fs-handler";
import useConfigurationStore from "@/stores/useConfigurationStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";

import Popup from "@/components/Popup.vue";
import LanguageDropdown from "@/components/LanguageDropdown.vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";

const selectMenuItem = ref("time_keeper");
const leftDrawerOpen = ref(true);
const miniState = ref(true);

const configurationStore = useConfigurationStore();
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
    isHolidayMode,
    isSicknessMode,
    isSicknessWorkTime,
    weeklyWorkingDays,
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

  configurationStore.isHolidayMode = isHolidayMode
    ? isHolidayMode
    : configurationStore.isHolidayMode;
  configurationStore.country = country ? country : configurationStore.country;
  configurationStore.state = state ? state : configurationStore.state;
  configurationStore.isSicknessMode = isSicknessMode
    ? isSicknessMode
    : configurationStore.isSicknessMode;
  configurationStore.isSicknessWorkTime = isSicknessWorkTime
    ? isSicknessWorkTime
    : configurationStore.isSicknessWorkTime;
  configurationStore.weeklyWorkingDays = weeklyWorkingDays
    ? weeklyWorkingDays
    : configurationStore.weeklyWorkingDays;
}

const dataFile = (await readFile("data.json")) as IData;
if (dataFile) {
  console.debug("Loaded data.json successfully");
  timekeeperStore.data = dataFile;
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
<style lang="scss">
.tooltip {
  font-size: 14px;
}
</style>
