import useConfigurationStore from "@/stores/useConfigurationStore";
import usePopupStore from "@/stores/usePopupStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";
import { ComposerTranslation } from "vue-i18n";

let timer: NodeJS.Timeout;

const configurationStore = useConfigurationStore();
const timekeeperStore = useTimekeepingStore();
const popupStore = usePopupStore();

const handleAutoSave = (t: ComposerTranslation) => {
  if (configurationStore.isAutoSave === true) {
    timer = autoSave(t);
  } else {
    clearInterval(timer);
    // save the false
    configurationStore
      .saveConfiguration()
      .then(() => {
        console.log("Wrote configuration.json.");
      })
      .catch(() => console.error("Could not write configuration.json."));
  }
};

const autoSave = (t: ComposerTranslation) => {
  return setInterval(() => {
    Promise.all([
      configurationStore.saveConfiguration(),
      timekeeperStore.saveData(),
    ])
      .then(() => {
        popupStore.showPopup(t, true);
      })
      .catch(() => {
        console.error("Could not write configuration.json.");
        popupStore.showPopup(t);
      });
  }, configurationStore.convertAutoSaveTimeToSeconds);
};

export { handleAutoSave };
