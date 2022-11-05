<template>
  <q-page padding>
    <div class="q-gutter-md row">
      <q-stepper v-model="step" animated>
        <q-step
          :name="1"
          title="Operation selection"
          icon="settings"
          :done="step > 1"
        >
          <q-select
            v-model="selectedOperation"
            :options="operationOptions"
            style="width: 100px"
            outlined
          />

          <q-stepper-navigation>
            <q-btn @click="step = 2" color="primary" label="Continue" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="File selection"
          icon="create_new_folder"
          :done="step > 2"
        >
          <q-select
            v-model="selectedFile"
            :options="fileOptions"
            style="width: 100px"
            outlined
          />

          <q-stepper-navigation>
            <q-btn
              @click="
                selectedOperation.value === 'export' ? (step = 4) : (step = 3)
              "
              color="primary"
              label="Continue"
            />
            <q-btn
              flat
              @click="step = 1"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="3" title="Upload file" icon="assignment">
          <q-file
            outlined
            v-model="uploadedFile"
            @update:model-value="handleImport"
            label="Upload file"
            accept=".json"
            style="width: 200px"
          >
            <template v-if="uploadedFile" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="uploadedFile = null"
                @click="uploadedFile = null"
                class="cursor-pointer"
              />
            </template>
          </q-file>
          <q-stepper-navigation>
            <q-btn
              color="primary"
              label="Continue"
              @click="
                typeof uploadedFile === 'undefined' ? (step = 3) : (step = 4)
              "
            />
            <q-btn
              flat
              @click="step = 2"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="4" title="Summary" icon="add_comment">
          <div class="col">
            <q-input
              class="row q-pb-sm"
              disable
              outlined
              v-model="selectedOperation.value"
              label="Selected Operation"
              style="width: 150px"
            />

            <q-input
              class="row q-pb-sm"
              disable
              outlined
              v-model="selectedFile.value"
              label="Selected Target File"
              style="width: 150px"
            />

            <div class="row q-pb-sm" v-if="uploadedFile">
              <q-input
                class="q-pr-md"
                disable
                outlined
                v-model="uploadedFile.name"
                label="Uploaded File"
                style="width: 150px"
              />
              <q-btn
                color="primary"
                icon="file_open"
                @click="showDataValue"
              ></q-btn>
            </div>

            <q-markdown v-if="isDataValueShown">
              <pre>
```json
{{ readFile }}
```
      </pre
              >
            </q-markdown>
          </div>

          <q-stepper-navigation>
            <q-btn color="primary" label="Finish" @click="finish" />
            <q-btn
              flat
              @click="step = 2"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <template v-slot:message>
          <q-banner v-if="step === 1" class="bg-primary text-white q-px-lg">
            Please select the desired operation...
          </q-banner>
          <q-banner
            v-else-if="step === 2"
            class="bg-primary text-white q-px-lg"
          >
            Please select the target file for the operation...
          </q-banner>
          <q-banner
            v-else-if="step === 3"
            class="bg-primary text-white q-px-lg"
          >
            Please select a .json file for {{ selectedFile.value }}...
          </q-banner>
          <q-banner v-else class="bg-blue-8 text-white q-px-lg">
            Do you really want to execute the following?
          </q-banner>
        </template>
      </q-stepper>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { IData, IMonth } from "@/models/month-model";
import useConfigurationStore from "@/stores/useConfigurationStore";
import usePopupStore from "@/stores/usePopupStore";
import useTimekeepingStore from "@/stores/useTimekeepingStore";
import { QMarkdown } from "@quasar/quasar-ui-qmarkdown";
import { exportFile } from "quasar";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const configurationStore = useConfigurationStore();
const timekeepingStore = useTimekeepingStore();

const fileReader = new FileReader();

const operationOptions = [
  {
    value: "import",
    label: "import",
  },
  {
    value: "export",
    label: "export",
  },
  {
    value: "backup",
    label: "backup",
  },
];

const fileOptions = [
  {
    value: "data",
    label: "data",
  },
  {
    value: "configuration",
    label: "configuration",
  },
];

const step = ref(1);

const selectedOperation = ref(operationOptions[0]);
const selectedFile = ref(fileOptions[0]);
const uploadedFile = ref();

const readFile = ref<IData>();

const isDataValueShown = ref(false);

const showDataValue = () => {
  isDataValueShown.value = !isDataValueShown.value;
};

const logData = () => {
  console.log(uploadedFile.value);
};

//TODO: use watch instead
const handleImport = () => {
  console.log(uploadedFile.value);
  if (uploadedFile.value) {
    fileReader.readAsText(uploadedFile.value);
  }

  fileReader.onload = () => {
    if (typeof fileReader.result === "string") {
      const obj = JSON.parse(fileReader.result);
      readFile.value = obj;
    }
  };

  fileReader.onerror = () => {
    usePopupStore().showPopup(t("error_file_load"));
    return;
  };
};

const finish = () => {
  const operation = selectedOperation.value;
  const file = selectedFile.value;

  if (operation.value === "export") {
    const status = exportFile(
      selectedFile.value.value,
      JSON.stringify(
        file.value === "data"
          ? timekeepingStore.data
          : configurationStore.$state
      ),
      "application/json"
    );

    //TODO: popup or first state or both
    if (!status) {
      console.log("could not do it");
    }
  }

  if (operation.value === "import" && readFile.value) {
    // TODO: check if object is valid

    isInputValid(readFile.value);

    timekeepingStore.data = readFile.value as IData;
    //TODO: popup or first state or both
  }

  if (operation.value === "backup") {
  }
};

const isInputValid = (input: any): boolean => {
  if (typeof input === "undefined") return false;

  let isValid = true;

  const years = Object.keys(input);
  // first level
  for (let index = 0; index < years.length; index++) {
    const year = years[index];

    // check for year
    if (/^\d+$/.test(year) === false) {
      isValid = false;
      break;
    }

    // check for month
    const months = input[years[index]];

    // check for cw

    // check for days
  }

  return true;
};

const isMonthValid = (month: IMonth): boolean => {};
</script>
