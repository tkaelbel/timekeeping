import { IData, IDayModel, IWeek, IWeekModel } from "@/models/month-model";
import { ITimekeeperStore } from "@/models/store-model";
import { getAllDaysOfMonth } from "@/utils/date-utils";
import { createFile } from "@/utils/fs-handler";
import { defineStore } from "pinia";
import useConfigurationStore from "./useConfigurationStore";

const configurationStore = useConfigurationStore();

export default defineStore("timekeepingStore", {
  state: () =>
    ({
      currentDate: new Date(),
      data: {},
    } as ITimekeeperStore),
  actions: {
    async saveData() {
      const { data } = this;
      try {
        await createFile("data", JSON.stringify(data));
        console.log("Successfully saved data");
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  getters: {
    allDaysOfMonth(): Map<number, IWeekModel> {
      return getAllDaysOfMonth(this.currentDate);
    },
    calculateOverallOvertime() {
      const { calculatedWeekOvertime } = calculateAdditionalInfos(this.data);
      if (calculatedWeekOvertime === 0) return 0;

      return calculatedWeekOvertime;
    },
    calculateRestVactionDays() {
      const { calculatedRestVacation } = calculateAdditionalInfos(this.data);
      if (calculatedRestVacation === 0) return 0;

      const dayHoursMustWork =
        configurationStore.weeklyHoursWorking /
        configurationStore.weeklyWorkingDays;
      const daysRest =
        configurationStore.yearlyVacationDays -
        calculatedRestVacation / dayHoursMustWork;

      return daysRest;
    },
    calculateOverallSickDays() {
      const { calculatedOverallSick } = calculateAdditionalInfos(this.data);
      if (calculatedOverallSick === 0) return 0;

      const dayHoursMustWork =
        configurationStore.weeklyHoursWorking /
        configurationStore.weeklyWorkingDays;
      return calculatedOverallSick / dayHoursMustWork;
    },
    calculateMonthSickDays() {
      const { calculatedMonthSick } = calculateAdditionalInfos(
        this.data,
        this.currentDate
      );
      if (calculatedMonthSick === 0) return 0;

      const dayHoursMustWork =
        configurationStore.weeklyHoursWorking /
        configurationStore.weeklyWorkingDays;
      return calculatedMonthSick / dayHoursMustWork;
    },
  },
});

const calculateAdditionalInfos = (data: IData, currentDate?: Date) => {
  let calculatedWeekOvertime = 0;
  let calculatedRestVacation = 0;
  let calculatedOverallSick = 0;
  let calculatedMonthSick = 0;

  const keyYears = Object.keys(data);
  keyYears.forEach((year: string) => {
    const months = data[year as unknown as number];
    const keyMonths = Object.keys(months);
    keyMonths.forEach((month: string) => {
      const cws = months[month];
      const keyCws = Object.keys(cws);
      keyCws.forEach((cw: string) => {
        const cwData = cws[cw as unknown as number];
        const calculatedWeek = calculateWeek(cwData);
        calculatedWeekOvertime += calculatedWeek.weekSumOvertime;
        calculatedRestVacation += calculatedWeek.weekSumVacation;
        calculatedOverallSick += calculatedWeek.weekSumSick;

        if (
          currentDate?.toLocaleDateString("en-US", { month: "short" }) === month
        ) {
          calculatedMonthSick += calculatedWeek.weekSumSick;
        }
      });
    });
  });

  return {
    calculatedWeekOvertime,
    calculatedRestVacation,
    calculatedOverallSick,
    calculatedMonthSick,
  };
};

/**
 * TODO: optimize
 * @param cw
 * @returns
 */
const calculateWeek = (cw: { [key: string]: IDayModel }) => {
  let weekSumOvertime = 0;
  let weekSumVacation = 0;
  let weekSumSick = 0;

  const holidays: IDayModel[] = [];

  const dayKeys = Object.keys(cw);
  dayKeys.forEach((day: string) => {
    if (cw[day].sicknessHours) {
      weekSumSick += cw[day].sicknessHours
        ? parseFloat(cw[day].sicknessHours as unknown as string)
        : 0;
    }

    if (cw[day].vacationHours) {
      weekSumVacation += cw[day].vacationHours
        ? parseFloat(cw[day].vacationHours as unknown as string)
        : 0;
    }

    if (cw[day].holiday?.isHoliday) {
      holidays.push(cw[day]);
      return;
    }

    if (!cw[day].holiday?.isHoliday) {
      weekSumOvertime += cw[day].hours
        ? parseFloat(cw[day].hours as unknown as string)
        : 0;
    }
  });

  return {
    weekSumOvertime:
      weekSumOvertime === 0
        ? 0
        : weekSumOvertime -
          (configurationStore.weeklyHoursWorking /
            configurationStore.weeklyWorkingDays) *
            (configurationStore.weeklyWorkingDays - holidays.length),
    weekSumVacation,
    weekSumSick,
  };
};
