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
      locale: "de",
      country: "DE",
      state: "HE",
      isSicknessMode: true,
      isSicknessWorkTime: true,
      isHolidayMode: true,
      weeklyWorkingDays: 5,
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
          country,
          state,
          isSicknessMode,
          isSicknessWorkTime,
          isHolidayMode,
          weeklyWorkingDays,
        } = this;

        const output = JSON.stringify({
          weeklyHoursWorking,
          yearlyVacationDays,
          isAutoSave,
          autoSaveTimeSeconds,
          isDarkMode,
          locale,
          country,
          state,
          isSicknessMode,
          isSicknessWorkTime,
          isHolidayMode,
          weeklyWorkingDays,
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
