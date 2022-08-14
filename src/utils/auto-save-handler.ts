import useConfigurationStore from "@/stores/useConfigurationStore";
import usePopupStore from "@/stores/usePopupStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";
import { DebuggerEventExtraInfo } from "vue";
import { ComposerTranslation } from "vue-i18n";

let timer: NodeJS.Timeout;

const configurationStore = useConfigurationStore();
const timekeeperStore = useTimekeepingStore();
const popupStore = usePopupStore();

const handleAutoSave = (t: ComposerTranslation) => {
  if (configurationStore.isAutoSave === true) {
    timer = autoSave(t);

    // Reset the timer if the autoSaveTimeSeconds have changed
    configurationStore.$subscribe((mutation, state) => {
      const mutationDeb = mutation.events as DebuggerEventExtraInfo;

      if (
        mutationDeb.key === "autoSaveTimeSeconds" &&
        mutationDeb.newValue != mutationDeb.oldValue &&
        mutationDeb.newValue < 10
      ) {
        clearInterval(timer);
        return;
      }

      if (
        mutationDeb.key === "autoSaveTimeSeconds" &&
        mutationDeb.newValue != mutationDeb.oldValue &&
        mutationDeb.newValue >= 10
      ) {
        console.log("Reseted timer to: ", mutationDeb.newValue);
        clearInterval(timer);
        timer = autoSave(t);
      }
    });
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
