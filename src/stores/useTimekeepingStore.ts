import { IData, IDayModel } from "@/models/month-model";
import { ITimekeeperStore } from "@/models/store-model";
import { createFile } from "@/utils/fs-handler";
import { defineStore } from "pinia";
import useConfigurationStore from "./useConfigurationStore";

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
    calculateOverallOvertime() {
      const { calculatedWeekOvertime } = calculateAdditionalInfos(this.data);
      if (calculatedWeekOvertime === 0) return 0;

      return calculatedWeekOvertime;
    },
    calculateRestVactionDays() {
      const { calculatedRestVacation } = calculateAdditionalInfos(this.data);
      if (calculatedRestVacation === 0) return 0;

      const dayHoursMustWork = useConfigurationStore().weeklyHoursWorking / 5;
      const daysRest =
        useConfigurationStore().yearlyVacationDays -
        calculatedRestVacation / dayHoursMustWork;

      return daysRest;
    },
    calculateOverallSickDays() {
      const { calculatedOverallSick } = calculateAdditionalInfos(this.data);
      if (calculatedOverallSick === 0) return 0;

      const dayHoursMustWork = useConfigurationStore().weeklyHoursWorking / 5;
      return calculatedOverallSick / dayHoursMustWork;
    },
    calculateMonthSickDays() {
      const { calculatedMonthSick } = calculateAdditionalInfos(
        this.data,
        this.currentDate
      );
      if (calculatedMonthSick === 0) return 0;

      const dayHoursMustWork = useConfigurationStore().weeklyHoursWorking / 5;
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

        console.log(
          currentDate?.toLocaleDateString("en-US", { month: "short" })
        );

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

  const dayKeys = Object.keys(cw);
  dayKeys.forEach((day: string) => {
    if (cw[day].sickness === true) {
      weekSumSick += cw[day].hours
        ? parseFloat(cw[day].hours as unknown as string)
        : 0;
    }

    if (cw[day].vacation === true) {
      weekSumVacation += cw[day].hours
        ? parseFloat(cw[day].hours as unknown as string)
        : 0;
    }

    weekSumOvertime += cw[day].hours
      ? parseFloat(cw[day].hours as unknown as string)
      : 0;
  });

  const daysWithoutWeekend = dayKeys.filter(
    (day) => day !== "sunday" && day !== "saturday"
  );

  if (daysWithoutWeekend.length < 5) {
    return {
      weekSumOvertime:
        weekSumOvertime === 0
          ? 0
          : weekSumOvertime -
            (useConfigurationStore().weeklyHoursWorking / 5) *
              daysWithoutWeekend.length,
      weekSumVacation,
      weekSumSick,
    };
  }

  return {
    weekSumOvertime:
      weekSumOvertime === 0
        ? 0
        : weekSumOvertime - useConfigurationStore().weeklyHoursWorking,
    weekSumVacation,
    weekSumSick,
  };
};
