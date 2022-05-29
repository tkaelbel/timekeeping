import useConfigurationStore from "@/stores/useConfigurationStore";
import usePopupStore from "@/stores/usePopupStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";

let timer: NodeJS.Timeout;

const configurationStore = useConfigurationStore();
const timekeeperStore = useTimekeepingStore();
const popupStore = usePopupStore();

const handleAutoSave = () => {
  if (configurationStore.isAutoSave === true) {
    timer = autoSave();
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

const autoSave = () => {
  return setInterval(() => {
    Promise.all([
      configurationStore.saveConfiguration(),
      timekeeperStore.saveData(),
    ])
      .then(() => {
        popupStore.showPopup(true);
      })
      .catch(() => {
        console.error("Could not write configuration.json.");
        popupStore.showPopup();
      });
  }, configurationStore.convertAutoSaveTimeToSeconds);
};

export { handleAutoSave };
