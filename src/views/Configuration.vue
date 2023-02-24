<template>
  <q-page padding>
    <div class="q-gutter-md row">
      <q-card
        class="cards"
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <div class="text-h6">{{ t("general") }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            type="text"
            filled
            v-model.number="configurationStore.weeklyWorkingDays"
            :label="t('weekly_working_days')"
            mask="#"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />

          <q-input
            type="text"
            filled
            v-model.number="configurationStore.weeklyHoursWorking"
            :label="t('weekly_work_time')"
            mask="###"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />

          <q-input
            type="text"
            filled
            v-model.number="configurationStore.yearlyVacationDays"
            :label="t('vacation_days')"
            mask="###"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
          />

        </q-card-section>
      </q-card>

      <q-card
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <span class="text-h6">{{ t("holiday") }}</span>

          <q-toggle
            color="secondary"
            v-model="configurationStore.isHolidayMode"
            checked-icon="beach_access"
            unchecked-icon="o_beach_access"
            size="lg"
            style="padding-left: 100px"
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
          <q-select
            filled
            v-model="country"
            style="width: 200px"
            :options="getHolidayCountries()"
            :label="t('country')"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
            emit-value
            map-options
          />

          <q-select
            filled
            v-model="state"
            style="width: 200px"
            :options="stateOptions"
            :label="t('state')"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
            emit-value
            map-options
          />
        </q-card-section>
      </q-card>

      <q-card
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <div class="text-h6">
            {{ t("sickness") }}

            <q-toggle
              color="secondary"
              v-model="configurationStore.isSicknessMode"
              checked-icon="sick"
              unchecked-icon="o_sick"
              size="lg"
              style="padding-left: 100px"
            >
              <q-tooltip class="tooltip">
                {{
                  configurationStore.isSicknessMode
                    ? t("sickness_mode_active")
                    : t("sickness_mode_inactive")
                }}
              </q-tooltip>
            </q-toggle>
          </div>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
          v-if="configurationStore.isSicknessMode"
        >
          <q-toggle
            color="secondary"
            v-model="configurationStore.isSicknessWorkTime"
            checked-icon="schedule"
            unchecked-icon="o_schedule"
            size="lg"
            :label="t('sickness_time')"
            left-label
          >
            <q-tooltip class="tooltip">
              {{
                configurationStore.isSicknessWorkTime
                  ? t("sickness_time_active")
                  : t("sickness_time_inactive")
              }}
            </q-tooltip>
          </q-toggle>
        </q-card-section>
      </q-card>

      <q-card
        :class="configurationStore.isDarkMode ? 'dark-secondary' : 'primary'"
      >
        <q-card-section>
          <div class="text-h6">
            {{ t("application") }}

            <q-toggle
              color="secondary"
              v-model="isAutoSave"
              checked-icon="save"
              unchecked-icon="o_save"
              size="lg"
              style="padding-left: 80px"
            >
              <q-tooltip class="tooltip">
                {{ isAutoSave ? t("auto_save_on") : t("auto_save_off") }}
              </q-tooltip>
            </q-toggle>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="configurationStore.isAutoSave">
          <q-input
            type="text"
            filled
            v-model.number="configurationStore.autoSaveTimeSeconds"
            :label="t('auto_save')"
            mask="#####"
            :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
            :rules="[ (val: number | any[]) => val >= 10 || t('invalid_save_time')]"
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
import { handleAutoSave } from "@/utils/auto-save-handler";
import { getHolidayCountries, getStates } from "@/utils/date-utils";
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const configurationStore = useConfigurationStore();
const { isAutoSave, country, state } = storeToRefs(configurationStore);

let lastCountry = country.value;
const stateOptions = computed(() => {
  if (lastCountry !== country.value) {
    state.value = "";
    lastCountry = country.value;
  }
  return getStates(country.value);
});

const onApply = async () => {
  try {
    await configurationStore.saveConfiguration();
    usePopupStore().showPopup(t, true);
  } catch (error) {
    console.error("Could not write configuration.json.");
    usePopupStore().showPopup(t);
  }
};

if (configurationStore.isAutoSave === true) handleAutoSave(t);

watch(isAutoSave, (_newIsAutoSave) => {
  handleAutoSave(t);
});
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
  width: 200px;
  padding-bottom: 32px;
}

.q-select {
  width: 200px;
  padding-bottom: 32px;
}
</style>
