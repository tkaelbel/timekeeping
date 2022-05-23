import { Ref } from "vue";
import { showPopup } from "./utils";

let timer: NodeJS.Timeout;

// const configurationStore = useConfigurationStore();
// const timekeeperStore = useTimekeepingStore();

const handleAutoSave = (
  isShown: Ref<boolean>,
  text: Ref<string>,
  isPositive: Ref<boolean>
) => {
  // if (configurationStore.isAutoSave === true) {
  //   timer = autoSave(isShown, text, isPositive);
  // } else {
  //   clearInterval(timer);
  //   // save the false
  //   configurationStore
  //     .saveConfiguration()
  //     .then(() => {
  //       console.log("Wrote configuration.json.");
  //     })
  //     .catch(() => console.error("Could not write configuration.json."));
  // }
};

//TODO: make the time configurable
const autoSave = (
  isShown: Ref<boolean>,
  text: Ref<string>,
  isPositive: Ref<boolean>
) => {
  // return setInterval(() => {
  //   Promise.all([
  //     configurationStore.saveConfiguration(),
  //     timekeeperStore.saveData(),
  //   ])
  //     .then(() => {
  //       showPopup(isShown, text, isPositive);
  //     })
  //     .catch(() => {
  //       console.error("Could not write configuration.json.");
  //       showPopup(isShown, text, isPositive, "Nicht gespeichert", false);
  //     });
  // }, configurationStore.convertAutoSaveTimeToSeconds);
};

export { handleAutoSave };
