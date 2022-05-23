import { IWeekModel } from "@/models/month-model";
import { ref } from "vue";

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

export { getAllDaysOfMonth };
