<template>
  <q-page padding>
    <div class="q-gutter-md row">
      <div class="q-gutter-md">
        <month-picker />
        <div class="q-gutter-md column">
          <information-card />
        </div>

        <div class="q-gutter-md column">
          <q-btn
            :label="t('save')"
            type="submit"
            @click="onSave"
            :class="configStore.isDarkMode ? 'dark-button' : 'light-button'"
          />
        </div>
      </div>

      <div class="q-gutter-md col row">
        <q-markup-table
          :class="configStore.isDarkMode ? 'dark-secondary' : 'primary'"
        >
          <thead>
            <tr>
              <th class="text-center">
                {{ t("calendar_week") }}
              </th>
              <th class="text-center">{{ t("monday") }}</th>
              <th class="text-center">{{ t("tuesday") }}</th>
              <th class="text-center">{{ t("wednesday") }}</th>
              <th class="text-center">{{ t("thursday") }}</th>
              <th class="text-center">{{ t("friday") }}</th>
              <th class="text-center">{{ t("saturday") }}</th>
              <th class="text-center">{{ t("sunday") }}</th>
              <th class="text-center">{{ t("week") }}</th>
              <th class="text-center">{{ t("overtime") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="[calendarWeek, weekday] in allDaysOfMonth"
              :key="calendarWeek"
            >
              <td class="text-left">{{ calendarWeek }}</td>

              <td class="text-center" v-for="day in weekday">
                <div v-if="day?.day">
                  {{ d(day.day, "weekday", locale) }}
                  <div class="q-gutter-md row">
                    <q-input
                      class="day-input"
                      type="number"
                      filled
                      :color="configStore.isDarkMode ? 'blue-grey' : 'blue'"
                      v-model="
                        inputValues[calendarWeek][
                          d(day.day, 'day', 'en').toLowerCase()
                        ].hours
                      "
                    >
                      <q-checkbox
                        dense
                        size="xs"
                        v-model="
                          inputValues[calendarWeek][
                            d(day.day, 'day', 'en').toLowerCase()
                          ].vacation
                        "
                        :color="configStore.isDarkMode ? 'blue-grey' : 'blue'"
                        :label="t('vacation_short')"
                        class="text-secondary text-weight-bold"
                      />
                    </q-input>
                  </div>
                </div>
              </td>

              <td class="text-center">
                <div>{{ n(weekSums(calendarWeek), "decimal", locale) }}</div>
              </td>
              <td class="text-center">
                <div>
                  {{ n(calculateOvertime(calendarWeek), "decimal", locale) }}
                </div>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { getAllDaysOfMonth } from "@/utils/date-utils";
import useTimekeepingStore from "@/stores/useTimekeepingStore";
import useConfigurationStore from "@/stores/useConfigurationStore";
import usePopupStore from "@/stores/usePopupStore";
import { useI18n } from "vue-i18n";

import MonthPicker from "@/components/MonthPicker.vue";
import InformationCard from "@/components/InformationCard.vue";

const { t, d, n, locale } = useI18n();

const { currentDate, data } = storeToRefs(useTimekeepingStore());

const timeKeeperStore = useTimekeepingStore();

const configStore = useConfigurationStore();

const allDaysOfMonth = computed(() => {
  return getAllDaysOfMonth(currentDate.value);
});

const inputValues = computed(() => {
  const year = currentDate.value.getFullYear();

  const monthName = d(currentDate.value, "month", locale.value);

  // try it with state as data holder
  const overallData = data.value;

  if (!overallData[year]) overallData[year] = {};

  const yearData = overallData[year];

  // if the state data is undefined we create on our own
  if (!yearData[monthName]) {
    // first set the current year
    yearData[monthName] = {};
    const month = yearData[monthName];

    allDaysOfMonth.value.forEach((value, index) => {
      const days = Object.keys(value);
      days.forEach((day) => {
        const weekDay = value[day];

        if (weekDay) {
          if (!month[index]) {
            month[index] = {
              [day]: { day: weekDay.day, hours: 0, vacation: false },
            };
          } else {
            month[index][day] = {
              day: weekDay.day,
              hours: 0,
              vacation: false,
            };
          }
        }
      });
    });
  }

  return yearData[monthName];
});

const weekSums = (cw: number) => {
  let weekSum = 0;

  const wholeWeek = inputValues.value[cw];
  if (!wholeWeek) return weekSum;

  const keys = Object.keys(wholeWeek);
  keys.forEach((key) => {
    weekSum += wholeWeek[key].hours
      ? parseFloat(wholeWeek[key].hours as unknown as string)
      : 0;
  });

  return weekSum;
};

const calculateOvertime = (cw: number) => {
  const weekSum = weekSums(cw);
  const wholeWeek = inputValues.value[cw];
  if (wholeWeek) {
    const daysWithoutWeekend = Object.keys(wholeWeek).filter(
      (day) => day !== "sunday" && day !== "saturday"
    );
    if (daysWithoutWeekend.length < 5) {
      return weekSum === 0
        ? 0
        : weekSum -
            (configStore.getWeeklyHoursWorkingAsNumber / 5) *
              daysWithoutWeekend.length;
    }
  }

  return weekSum === 0
    ? 0
    : weekSum - configStore.getWeeklyHoursWorkingAsNumber;
};

const onSave = async () => {
  try {
    await timeKeeperStore.saveData();
    usePopupStore().showPopup(t, true);
  } catch (error) {
    console.error("Could not write configuration.json.");
    usePopupStore().showPopup(t);
  }
};
</script>
<style lang="scss">
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.q-table th {
  font-size: 14px;
}

.q-field__append {
  display: none;
}

.day-input {
  width: 100px !important;
  height: 70px !important;
}

.flex-break {
  flex: 1 0 100% !important;
}
</style>
