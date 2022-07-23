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
      country: "DE",
      state: "HE",
      isSicknessMode: true,
    } as IConfigurationStore),
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
