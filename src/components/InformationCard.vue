<template>
  <q-card :class="configStore.isDarkMode ? 'dark-secondary' : 'primary'">
    <q-card-section>
      <div class="text-h6">Information</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ t("week_time_debit") }}:
      {{ n(configStore.weeklyHoursWorking, "decimal", locale) }}
    </q-card-section>

    <q-card-section>
      {{ t("overall_overtime") }}:
      {{ n(calculateOverallOvertime, "decimal", locale) }}
    </q-card-section>

    <q-card-section>
      {{ t("vacation_days") }}:
      {{
        n(configStore.yearlyVacationDays, "decimal", locale)
      }}</q-card-section
    >

    <q-card-section>
      {{ t("vacation_days_rest") }}:
      {{ n(calculateRestVactionDays, "decimal", locale) }}</q-card-section
    >
  </q-card>
</template>
<script setup lang="ts">
import useConfigurationStore from "@/stores/useConfigurationStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const configStore = useConfigurationStore();

const { calculateOverallOvertime, calculateRestVactionDays } = storeToRefs(
  useTimekeepingStore()
);

const { t, n, locale } = useI18n();
</script>
