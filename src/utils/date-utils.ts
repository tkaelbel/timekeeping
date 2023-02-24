import { IHolidayModel } from "./../models/month-model";
import useConfigurationStore from "@/stores/useConfigurationStore";
import { IWeekModel } from "@/models/month-model";
import { ref } from "vue";
import Holidays from "date-holidays";

const configurationStore = useConfigurationStore();

const getAllDaysOfMonth = (date: Date) => {
  const tempDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const allDays: Map<number, IWeekModel> = new Map();

  while (date.getMonth() === tempDate.getMonth()) {
    const weekNumber = getWeekNumber(tempDate);

    if (!allDays.get(weekNumber)) {
      allDays.set(weekNumber, {
        monday: undefined,
        tuesday: undefined,
        wednesday: undefined,
        thursday: undefined,
        friday: undefined,
        saturday: undefined,
        sunday: undefined,
      });
    }

    const week = allDays.get(weekNumber);
    const dayName = tempDate
      .toLocaleDateString("en-EN", { weekday: "long" })
      .toLowerCase();
    if (week) {
      week[dayName] = {
        day: new Date(tempDate),
        hours: ref(0),
        begin: ref('0'),
        end: ref('0'),
        breakTime: ref('0'),
      };
    }

    tempDate.setDate(tempDate.getDate() + 1);
  }

  return allDays;
};

const getWeekNumber = (date: Date) => {
  const tdt = new Date(date.valueOf());
  const dayn = (date.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  const firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - tdt.valueOf()) / 604800000);
};

const isHoliday = (date: Date): IHolidayModel => {
  const hd = new Holidays();
  hd.init(configurationStore.country, configurationStore.state);

  const holiday = hd.isHoliday(date);

  if (!holiday) return { holidayName: "", isHoliday: false };

  if (holiday[0].type !== "public")
    return { holidayName: holiday[0].name, isHoliday: false };

  return { holidayName: holiday[0].name, isHoliday: true };
};

const getHolidayCountries = (): Array<{
  value: string;
  label: string;
}> => {
  const countries = new Holidays().getCountries();
  return Object.keys(countries)
    .filter((key) => key === "DE" || key === "US")
    .map((value) => {
      return {
        value,
        label: countries[value],
      };
    });
};

const getStates = (
  country: string
): Array<{ value: string; label: string }> => {
  const states = new Holidays().getStates(country);
  return Object.keys(states).map((value) => {
    return {
      value,
      label: states[value],
    };
  });
};

export { getAllDaysOfMonth, isHoliday, getHolidayCountries, getStates };
