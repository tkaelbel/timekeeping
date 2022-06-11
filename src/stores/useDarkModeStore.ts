import { IDarkMode } from "./../models/store-model";
import { defineStore } from "pinia";

export default defineStore("darkMode", {
  state: () =>
    ({
      isActive: false,
    } as IDarkMode),
});
