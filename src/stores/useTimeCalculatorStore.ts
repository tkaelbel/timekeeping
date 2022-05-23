import { ITimeCalulatorStore } from "@/models/store-model";
import { defineStore } from "pinia";

export default defineStore("timeCalculator", {
  state: () =>
    ({
      breakTime: "",
      endTime: "",
      startTime: "",
    } as ITimeCalulatorStore),
});
