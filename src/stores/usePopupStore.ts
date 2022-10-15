import { IPopupStore } from "@/models/store-model";
import { defineStore } from "pinia";

export default defineStore("popup", {
  state: () =>
    ({
      isPositive: false,
      message: "",
      show: false,
    } as IPopupStore),
  actions: {
    showPopup(message: string, isPositive?: boolean) {
      this.show = true;
      this.message = message;
      this.isPositive = isPositive ? isPositive : false;

      setTimeout(() => {
        this.show = false;
      }, 3000);
    },
  },
});
