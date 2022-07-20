<template>
  <q-page padding>
    <div class="q-gutter-md column">
      <div class="q-gutter-md">
        <q-input
          type="text"
          filled
          v-model="configurationStore.weeklyHoursWorking"
          :label="t('weekly_work_time')"
          style="width: 250px; padding-bottom: 32px"
          mask="###"
          :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
        />

        <q-input
          type="text"
          filled
          v-model="configurationStore.yearlyVacationDays"
          :label="t('vacation_days')"
          style="width: 250px; padding-bottom: 32px"
          mask="###"
          :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
        />

        <q-input
          type="text"
          filled
          v-model="configurationStore.autoSaveTimeSeconds"
          :label="t('auto_save')"
          style="width: 250px; padding-bottom: 32px"
          mask="#####"
          :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
        />

        <q-input
          type="text"
          filled
          v-model="configurationStore.country"
          :label="t('country')"
          style="width: 250px; padding-bottom: 32px"
          :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
        />

        <q-input
          type="text"
          filled
          v-model="configurationStore.state"
          :label="t('state')"
          style="width: 250px; padding-bottom: 32px"
          :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
        />

        <div>
          <q-btn
            :label="t('save')"
            type="submit"
            :class="
              configurationStore.isDarkMode ? 'dark-button' : 'light-button'
            "
            @click="onApply"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useConfigurationStore from "@/stores/useConfigurationStore";
import usePopupStore from "@/stores/usePopupStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const configurationStore = useConfigurationStore();

const onApply = async () => {
  try {
    await configurationStore.saveConfiguration();
    usePopupStore().showPopup(t, true);
  } catch (error) {
    console.error("Could not write configuration.json.");
    usePopupStore().showPopup(t);
  }
};
</script>
