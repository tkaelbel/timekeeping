<template>
  <q-page padding>
    <div class="q-gutter-md row">
      <q-card
        class="cards"
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <div class="text-h6">General</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            type="text"
            filled
            v-model="configurationStore.weeklyWorkingDays"
            :label="t('weekly_working_days')"
            mask="#"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />

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

          <q-toggle
            color="secondary"
            v-model="configurationStore.isSicknessMode"
            checked-icon="sick"
            unchecked-icon="clear"
            size="xl"
            :label="
              configurationStore.isSicknessMode
                ? t('sickness_mode_active')
                : t('sickness_mode_inactive')
            "
          />
        </q-card-section>
      </q-card>

      <q-card
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <span class="text-h6">Holiday</span>

          <q-toggle
            color="secondary"
            v-model="configurationStore.isHolidayMode"
            checked-icon="beach_access"
            unchecked-icon="clear"
            size="lg"
            style="padding-left: 125px"
          >
            <q-tooltip class="tooltip">
              {{
                configurationStore.isHolidayMode
                  ? t("holiday_mode_active")
                  : t("holiday_mode_inactive")
              }}
            </q-tooltip>
          </q-toggle>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
          v-if="configurationStore.isHolidayMode"
        >
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
        class="cards"
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

<style scoped lang="scss">
.cards {
  padding-top: 5px;
}

.q-card__section {
  min-height: 75px;
}
.q-card-section {
  min-width: 300px;
}

.q-input {
  width: 250px;
  padding-bottom: 32px;
}
</style>
