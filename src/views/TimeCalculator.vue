<template>
  <q-page padding>
    <div class="q-gutter-md row">
      <q-input
        type="text"
        filled
        v-model="store.startTime"
        :label="t('work_time_start')"
        mask="##:##"
        :color="isDarkMode ? 'blue-grey' : 'blue'"
      ></q-input>
      <q-input
        type="text"
        filled
        v-model="store.breakTime"
        :label="t('break')"
        mask="##:##"
        :color="isDarkMode ? 'blue-grey' : 'blue'"
      ></q-input>
      <q-input
        type="text"
        filled
        v-model="store.endTime"
        :label="t('work_time_end')"
        mask="##:##"
        :color="isDarkMode ? 'blue-grey' : 'blue'"
      ></q-input>
      <div class="q-pt-md">
        <span class="q-pr-sm text-h6"
          >{{ calculateTime ? calculateTime : 0 }}
        </span>
        <span>{{ t("work_time_in_hours") }}</span>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { subHours, subMinutes } from "date-fns";
import useTimeCalculatorStore from "@/stores/useTimeCalculatorStore";
import { useI18n } from "vue-i18n";
import useConfigurationStore from "@/stores/useConfigurationStore";
import { storeToRefs } from "pinia";

const { t, n, locale } = useI18n();

const store = useTimeCalculatorStore();

const { isDarkMode } = storeToRefs(useConfigurationStore());

const getDateFromInput = (time: string): Date => {
  const date = new Date();
  const splittedTime = time.split(":");
  if (splittedTime && splittedTime.length > 1) {
    date.setHours(splittedTime[0] as unknown as number);
    date.setMinutes(splittedTime[1] as unknown as number);
  }

  return date;
};

const calculateTime = computed(() => {
  if (store.startTime && store.breakTime && store.endTime) {
    const dateEndTime = getDateFromInput(store.endTime);
    const dateBreakTime = getDateFromInput(store.breakTime);
    const dateStartTime = getDateFromInput(store.startTime);

    let temp = subMinutes(dateEndTime, dateBreakTime.getMinutes());
    temp = subMinutes(temp, dateStartTime.getMinutes());
    temp = subHours(temp, dateBreakTime.getHours());
    temp = subHours(temp, dateStartTime.getHours());

    const hour = temp.getHours();
    const minutesInHours = temp.getMinutes() / 60;
    return n(hour + minutesInHours, "decimal", locale.value);
  }
  return undefined;
});
</script>
