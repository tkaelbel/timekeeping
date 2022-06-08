import { IPopupStore } from "@/models/store-model";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";

export default defineStore("popup", {
  state: () =>
    ({
      isPositive: false,
      message: "",
      show: false,
    } as IPopupStore),
  actions: {
    showPopup(isPositive?: boolean) {
      const { t } = useI18n();

      this.show = true;
      this.message = isPositive ? t("saved") : t("not_saved");
      this.isPositive = isPositive ? isPositive : false;

      setTimeout(() => {
        this.show = false;
      }, 3000);
    },
  },
});
