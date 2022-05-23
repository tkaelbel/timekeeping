<template>
  <q-page padding>
    <div class="q-gutter-md row">
      <div class="q-gutter-md">
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
              :label="
                month.toLocaleDateString('de-DE', {
                  month: 'short',
                })
              "
              no-caps
              no-outline
              no-ripple
              rounded
              @click="selectMonth(month)"
            ></q-btn>
          </div>
        </div>

        <div class="q-gutter-md column">
          <q-card class="my-card">
            <q-card-section>
              <div class="text-h6">Information</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Wochenarbeiszeit Soll: {{ configStore.weeklyHoursWorking }}
            </q-card-section>

            <q-card-section>
              Gesamtüberstunden: {{ calculateOverallOvertime }}
            </q-card-section>

            <q-card-section>
              Urlaubstage: {{ configStore.yearlyVacationDays }}</q-card-section
            >

            <q-card-section>
              Urlaubstage Rest: {{ calculateRestVactionDays }}</q-card-section
            >
          </q-card>
        </div>

        <div class="q-gutter-md column">
          <q-btn
            label="Speichern"
            type="submit"
            color="primary"
            @click="onSave"
          />
        </div>
      </div>

      <div class="q-gutter-md col row">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-center">KW</th>
              <th class="text-center">Montag</th>
              <th class="text-center">Dienstag</th>
              <th class="text-center">Mittwoch</th>
              <th class="text-center">Donnerstag</th>
              <th class="text-center">Freitag</th>
              <th class="text-center">Samstag</th>
              <th class="text-center">Sonntag</th>
              <th class="text-center">Woche</th>
              <th class="text-center">Überstunden</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="weekday in allDaysOfMonth.keys()" :key="weekday">
              <td class="text-left">{{ weekday }}</td>
              <td class="text-center">
                <div v-if="allDaysOfMonth.get(weekday)?.monday?.day">
                  {{
                    allDaysOfMonth
                      .get(weekday)
                      ?.monday?.day.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                      })
                  }}
                  <div class="q-gutter-md row">
                    <q-input
                      class="day-input"
                      type="number"
                      filled
                      v-model="inputValues[weekday].monday.hours"
                    >
                      <q-checkbox
                        dense
                        size="xs"
                        v-model="inputValues[weekday].monday.vacation"
                        label="U"
                        class="text-secondary text-weight-bold"
                      />
                    </q-input>
                  </div>
                </div>
              </td>
              <td class="text-center">
                <div v-if="allDaysOfMonth.get(weekday)?.tuesday?.day">
                  {{
                    allDaysOfMonth
                      .get(weekday)
                      ?.tuesday?.day.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                      })
                  }}
                  <q-input
                    class="day-input"
                    type="number"
                    filled
                    v-model="inputValues[weekday].tuesday.hours"
                  >
                    <q-checkbox
                      dense
                      size="xs"
                      v-model="inputValues[weekday].tuesday.vacation"
                      label="U"
                      class="text-secondary text-weight-bold"
                    />
                  </q-input>
                </div>
              </td>
              <td class="text-center">
                <div v-if="allDaysOfMonth.get(weekday)?.wednesday?.day">
                  {{
                    allDaysOfMonth
                      .get(weekday)
                      ?.wednesday?.day.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                      })
                  }}
                  <q-input
                    class="day-input"
                    type="number"
                    filled
                    v-model="inputValues[weekday].wednesday.hours"
                  >
                    <q-checkbox
                      dense
                      size="xs"
                      v-model="inputValues[weekday].wednesday.vacation"
                      label="U"
                      class="text-secondary text-weight-bold"
                    />
                  </q-input>
                </div>
              </td>
              <td class="text-center">
                <div v-if="allDaysOfMonth.get(weekday)?.thursday?.day">
                  {{
                    allDaysOfMonth
                      .get(weekday)
                      ?.thursday?.day.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                      })
                  }}
                  <q-input
                    class="day-input"
                    type="number"
                    filled
                    v-model="inputValues[weekday].thursday.hours"
                  >
                    <q-checkbox
                      dense
                      size="xs"
                      v-model="inputValues[weekday].thursday.vacation"
                      label="U"
                      class="text-secondary text-weight-bold"
                    />
                  </q-input>
                </div>
              </td>
              <td class="text-center">
                <div v-if="allDaysOfMonth.get(weekday)?.friday?.day">
                  {{
                    allDaysOfMonth
                      .get(weekday)
                      ?.friday?.day.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                      })
                  }}
                  <q-input
                    class="day-input"
                    type="number"
                    filled
                    v-model="inputValues[weekday].friday.hours"
                  >
                    <q-checkbox
                      dense
                      size="xs"
                      v-model="inputValues[weekday].friday.vacation"
                      label="U"
                      class="text-secondary text-weight-bold"
                    />
                  </q-input>
                </div>
              </td>
              <td class="text-center">
                <div v-if="allDaysOfMonth.get(weekday)?.saturday?.day">
                  {{
                    allDaysOfMonth
                      .get(weekday)
                      ?.saturday?.day.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                      })
                  }}
                  <q-input
                    class="day-input"
                    type="number"
                    filled
                    v-model="inputValues[weekday].saturday.hours"
                  >
                    <q-checkbox
                      dense
                      size="xs"
                      v-model="inputValues[weekday].saturday.vacation"
                      label="U"
                      class="text-secondary text-weight-bold"
                    />
                  </q-input>
                </div>
              </td>
              <td class="text-center">
                <div v-if="allDaysOfMonth.get(weekday)?.sunday?.day">
                  {{
                    allDaysOfMonth
                      .get(weekday)
                      ?.sunday?.day.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                      })
                  }}
                  <q-input
                    class="day-input"
                    type="number"
                    filled
                    v-model="inputValues[weekday].sunday.hours"
                  >
                    <q-checkbox
                      dense
                      size="xs"
                      v-model="inputValues[weekday].sunday.vacation"
                      label="U"
                      class="text-secondary text-weight-bold"
                    />
                  </q-input>
                </div>
              </td>

              <td class="text-center">
                <div>{{ weekSums(weekday).toLocaleString("de-DE") }}</div>
              </td>
              <td class="text-center">
                <div>
                  {{ calculateOvertime(weekday).toLocaleString("de-DE") }}
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

const {
  currentDate,
  data,
  calculateOverallOvertime,
  calculateRestVactionDays,
} = storeToRefs(useTimekeepingStore());

const timeKeeperStore = useTimekeepingStore();

const configStore = useConfigurationStore();

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

const allDaysOfMonth = computed(() => {
  return getAllDaysOfMonth(currentDate.value);
});

const inputValues = computed(() => {
  const year = currentDate.value.getFullYear();

  const monthName = currentDate.value.toLocaleDateString("de-DE", {
    month: "short",
  });

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
            (configStore.weeklyHoursWorking / 5) * daysWithoutWeekend.length;
    }
  }

  return weekSum === 0 ? 0 : weekSum - configStore.weeklyHoursWorking;
};

const selectMonth = (month: Date) => {
  currentDate.value = month;
};

const onSave = async () => {
  try {
    await timeKeeperStore.saveData();
    usePopupStore().showPopup(true);
  } catch (error) {
    console.error("Could not write configuration.json.");
    usePopupStore().showPopup();
  }
};
</script>
<style lang="scss">
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
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

.monthpicker {
  width: 250px;
}

.monthpicker-current {
  font-weight: bold;
}

.monthpicker-header {
  font-weight: bold;
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
