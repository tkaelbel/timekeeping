<template>
  <div class="monthpicker">
    <div class="monthpicker-header">
      <q-btn
        dense
        flat
        icon="chevron_left"
        round
        @click="changeYear(false)"
      ></q-btn>
      {{ currentDate.getFullYear() }}
      <q-btn
        dense
        flat
        icon="chevron_right"
        round
        @click="changeYear(true)"
      ></q-btn>
    </div>
    <div class="monthpicker-months">
      <q-btn
        :key="month.getTime()"
        v-for="month in displayedMonths"
        :label="d(month, 'month', locale)"
        no-caps
        no-outline
        no-ripple
        rounded
        :class="darkModeStore.isActive ? 'dark-button' : 'light-button'"
        @click="selectMonth(month)"
      ></q-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
import useDarkModeStore from "@/stores/useDarkModeStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { d, locale } = useI18n();

const darkModeStore = useDarkModeStore();

const { currentDate } = storeToRefs(useTimekeepingStore());

const displayedMonths = computed(() => {
  const months: Date[] = [];

  for (let i = 0; i < 12; i++) {
    months.push(new Date(currentDate.value.getFullYear(), i));
  }

  return months;
});

const changeYear = (up: boolean) => {
  if (up) {
    const tempDate = new Date(currentDate.value);
    tempDate.setMonth(tempDate.getMonth() + 12);
    currentDate.value = tempDate;
  } else {
    const tempDate = new Date(currentDate.value);
    tempDate.setMonth(tempDate.getMonth() - 12);
    currentDate.value = tempDate;
  }
};

const selectMonth = (month: Date) => {
  currentDate.value = month;
};
</script>
<style lang="scss">
.monthpicker {
  width: 250px;
}

.monthpicker-current {
  font-weight: bold;
}

.monthpicker-header {
  font-weight: bold;
  font-size: 18px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.monthpicker-months {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.monthpicker-months .q-btn {
  box-shadow: none;
  margin: 5px 0;
  width: 30%;
}
</style>
