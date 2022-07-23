<template>
  <q-page padding>
    <div class="q-gutter-md row">
      <q-card
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <div class="text-h6">General</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            type="text"
            filled
            v-model="configurationStore.weeklyHoursWorking"
            :label="t('weekly_work_time')"
            mask="###"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />

          <q-input
            type="text"
            filled
            v-model="configurationStore.yearlyVacationDays"
            :label="t('vacation_days')"
            mask="###"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />

          <q-checkbox
            dense
            size="md"
            v-model="configurationStore.isSicknessMode"
            label="Allow sickness mode?"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'primary'"
          />
        </q-card-section>
      </q-card>

      <q-card
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <div class="text-h6">Location</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            type="text"
            filled
            v-model="configurationStore.country"
            :label="t('country')"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />

          <q-input
            type="text"
            filled
            v-model="configurationStore.state"
            :label="t('state')"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />
        </q-card-section>
      </q-card>

      <q-card
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <div class="text-h6">Technical</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            type="text"
            filled
            v-model="configurationStore.autoSaveTimeSeconds"
            :label="t('auto_save')"
            mask="#####"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pt-md">
      <q-btn
        :label="t('save')"
        type="submit"
        :class="configurationStore.isDarkMode ? 'dark-button' : 'light-button'"
        @click="onApply"
      />
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

<style lang="scss">
.q-input {
  width: 250px;
  padding-bottom: 32px;
}
</style>
