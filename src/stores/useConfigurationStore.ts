import { IConfigurationStore } from "@/models/store-model";
import { createFile } from "@/utils/fs-handler";
import { defineStore } from "pinia";

export default defineStore("configurationStore", {
  state: () =>
    ({
      yearlyVacationDays: 30,
      weeklyHoursWorking: 39,
      isAutoSave: false,
      autoSaveTimeSeconds: 15,
      isDarkMode: false,
      locale: "en",
    } as IConfigurationStore),
  getters: {
    convertAutoSaveTimeToSeconds(): number {
      return this.autoSaveTimeSeconds * 1000;
    },
  },
  actions: {
    async saveConfiguration() {
      try {
        const {
          yearlyVacationDays,
          weeklyHoursWorking,
          isAutoSave,
          autoSaveTimeSeconds,
          isDarkMode,
          locale,
        } = this;

        // quasar always returns values of fields as string...
        const numYearlyVacationDays = Number(yearlyVacationDays);
        const numWeeklyHoursWorking = Number(weeklyHoursWorking);
        const numAutoSaveTimeSeconds = Number(autoSaveTimeSeconds);

        const output = JSON.stringify({
          weeklyHoursWorking: numWeeklyHoursWorking,
          yearlyVacationDays: numYearlyVacationDays,
          isAutoSave,
          autoSaveTimeSeconds: numAutoSaveTimeSeconds,
          isDarkMode,
          locale,
        });
        await createFile("configuration", output);
        console.debug("Wrote configuration.json successfully");
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});
