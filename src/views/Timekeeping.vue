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
              v-for="[calendarWeek, weekday] in timeKeeperStore.allDaysOfMonth"
              :key="calendarWeek"
            >
              <td class="text-left text-weight-medium">
                {{ calendarWeek }}
              </td>

              <td class="text-center" v-for="day in weekday">
                <div v-if="day?.day" class="text-center">
                  <div class="text-weight-medium">
                    {{ d(day.day, "weekday", locale) }}
                    <q-icon
                      v-if="
                        configStore.isHolidayMode &&
                        inputValues[calendarWeek][
                          d(day.day, 'day', 'en').toLowerCase()
                        ].holiday?.holidayName
                      "
                      class="holiday-icon"
                      name="o_star"
                      size="18px"
                    ></q-icon>
                  </div>

                  <q-tooltip
                    v-if="
                      configStore.isHolidayMode &&
                      inputValues[calendarWeek][
                        d(day.day, 'day', 'en').toLowerCase()
                      ].holiday?.holidayName
                    "
                    class="tooltip"
                  >
                    {{
                      inputValues[calendarWeek][
                        d(day.day, "day", "en").toLowerCase()
                      ].holiday?.holidayName
                    }}
                  </q-tooltip>

                  <div class="q-gutter-md col">
                    <calendar-field
                      :day="
                        inputValues[calendarWeek][
                          d(day.day, 'day', 'en').toLowerCase()
                        ]
                      "
                    ></calendar-field>
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
import { isHoliday } from "@/utils/date-utils";
import useTimekeepingStore from "@/stores/useTimekeepingStore";
import useConfigurationStore from "@/stores/useConfigurationStore";
import usePopupStore from "@/stores/usePopupStore";
import { useI18n } from "vue-i18n";

import MonthPicker from "@/components/MonthPicker.vue";
import InformationCard from "@/components/InformationCard.vue";
import CalendarField from "@/components/CalendarField.vue";

const { t, d, n, locale } = useI18n();

const { currentDate, data } = storeToRefs(useTimekeepingStore());

const timeKeeperStore = useTimekeepingStore();

const configStore = useConfigurationStore();

const inputValues = computed(() => {
  const year = currentDate.value.getFullYear();

  const monthName = d(currentDate.value, "month", "en");

  // try it with state as data holder
  const overallData = data.value;

  if (!overallData[year]) overallData[year] = {};

  const yearData = overallData[year];

  // if the state data is undefined we create on our own
  if (!yearData[monthName]) {
    // first set the current year
    yearData[monthName] = {};
    const month = yearData[monthName];

    timeKeeperStore.allDaysOfMonth.forEach((value, index) => {
      const days = Object.keys(value);
      days.forEach((day) => {
        const weekDay = value[day];

        if (weekDay) {
          if (!month[index]) {
            month[index] = {
              [day]: {
                day: weekDay.day,
                hours: 0,
                sicknessHours: 0,
                vacationHours: 0,
                holiday: isHoliday(weekDay.day),
                begin: "",
                end: "",
                pause: "",
              },
            };
          } else {
            month[index][day] = {
              day: weekDay.day,
              hours: 0,
              sicknessHours: 0,
              vacationHours: 0,
              holiday: isHoliday(weekDay.day),
              begin: "",
              end: "",
              pause: "",
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
    // Calculate work time week
    weekSum += wholeWeek[key].hours ? wholeWeek[key].hours : 0;

    // Add sickness if allowed
    if (configStore.isSicknessMode && configStore.isSicknessWorkTime) {
      weekSum += wholeWeek[key].sicknessHours
        ? wholeWeek[key].sicknessHours
        : 0;
    }

    // Add vacation if set
    weekSum += wholeWeek[key].vacationHours ? wholeWeek[key].vacationHours : 0;
  });

  return weekSum;
};

//TODO: Change
const calculateOvertime = (cw: number) => {
  const weekSum = weekSums(cw);
  const wholeWeek = inputValues.value[cw];
  if (wholeWeek) {
    const holidays = Object.keys(wholeWeek).filter(
      (day) => wholeWeek[day].holiday?.isHoliday
    );

    // filter weekend
    // TODO: add configuration property
    const dayKeysWithoutWeekend = Object.keys(wholeWeek).filter(
      (day: string) => day !== "sunday" && day !== "saturday"
    );

    const days =
      dayKeysWithoutWeekend.length < configStore.weeklyWorkingDays
        ? dayKeysWithoutWeekend.length - holidays.length
        : configStore.weeklyWorkingDays - holidays.length;

    return weekSum === 0 ? 0 : weekSum - configStore.getDayWorkingHours * days;
  }
  return weekSum === 0 ? 0 : weekSum - configStore.weeklyHoursWorking;
};

const onSave = async () => {
  try {
    debugger;
    await timeKeeperStore.saveData();
    usePopupStore().showPopup(t, true);
    debugger;
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

tr {
  height: 125px;
}
.q-table th {
  font-size: 14px;
}

.q-field__append {
  display: none;
}

.day-input {
  width: 120px !important;
}

.q-field__control {
  height: 50px !important;
}

.flex-break {
  flex: 1 0 100% !important;
}

.holiday-icon {
  bottom: 2px;
}
</style>
