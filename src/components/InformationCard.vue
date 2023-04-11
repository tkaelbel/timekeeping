<template>
  <q-card :class="configStore.isDarkMode ? 'dark-secondary' : 'primary'">
    <q-card-section>
      <div class="text-h6">{{ t("statistics") }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ t("week_time_debit") }}:
      {{ n(configStore.weeklyHoursWorking, "decimal", locale) }}
    </q-card-section>

    <q-card-section>
      {{ t("monthly_overtime") }}:
      {{ n(calculateMonthlyOvertime, "decimal", locale) }}
    </q-card-section>

    <q-card-section>
      {{ t("yearly_overtime") }}:
      {{ n(calculateYearlyOvertime, "decimal", locale) }}
    </q-card-section>

    <q-card-section>
      {{ t("overall_overtime") }}:
      {{ n(calculateOverallOvertime, "decimal", locale) }}
    </q-card-section>

    <q-separator />

    <q-card-section>
      {{ t("vacation_days") }}:
      {{ n(configStore.yearlyVacationDays, "decimal", locale) }}
    </q-card-section>

    <q-card-section>
      {{ t("vacation_days_rest") }}:
      {{ n(calculateRestVactionDays, "decimal", locale) }}
    </q-card-section>

    <q-separator />

    <q-card-section v-if="configStore.isSicknessMode === true">
      {{ t("days_sick_month") }}:
      {{ n(calculateMonthSickDays, "decimal", locale) }}
    </q-card-section>

    <q-card-section v-if="configStore.isSicknessMode === true">
      {{ t("overall_sick_days") }}:
      {{ n(calculateOverallSickDays, "decimal", locale) }}
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import useConfigurationStore from "@/stores/useConfigurationStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const configStore = useConfigurationStore();

const {
  calculateOverallOvertime,
  calculateRestVactionDays,
  calculateOverallSickDays,
  calculateMonthSickDays,
  calculateMonthlyOvertime,
  calculateYearlyOvertime,
} = storeToRefs(useTimekeepingStore());

const { t, n, locale } = useI18n();
</script>
