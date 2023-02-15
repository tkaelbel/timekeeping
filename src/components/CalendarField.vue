<template>
  <q-input
    class="day-input"
    type="number"
    filled
    :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
    :disable="configurationStore.isHolidayMode && day.holiday?.isHoliday"
    v-model.number="day.hours"
    v-if="currentSelected.value === selectOptions[0].value"
  >
    <q-btn-dropdown flat dense class="button-dropdown" size="md">
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left :name="currentSelected.icon" />
        </div>
      </template>
      <q-list class="list">
        <q-item
          v-for="sel in selectOptionsRef"
          clickable
          v-close-popup
          @click="selectOption(sel)"
        >
          <q-item-section class="item-section">
            <q-icon :name="sel.icon" size="20px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="q-pt-xs">{{ t(sel.label) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-input>

  <q-input
    class="day-input"
    type="number"
    filled
    :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
    :disable="configurationStore.isHolidayMode && day.holiday?.isHoliday"
    v-model.number="day.breakHours"
    v-if="
      selectOptionsRefContains('break') &&
      currentSelected.value === selectOptions[1].value &&
      configurationStore.allowBreakInput
    "
  >
    <q-btn-dropdown flat dense class="button-dropdown" size="md">
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left :name="currentSelected.icon" />
        </div>
      </template>
      <q-list class="list">
        <q-item
          v-for="sel in selectOptionsRef"
          clickable
          v-close-popup
          @click="selectOption(sel)"
        >
          <q-item-section class="item-section">
            <q-icon :name="sel.icon" size="20px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="q-pt-xs">{{ t(sel.label) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-input>

  <q-input
    class="day-input"
    type="number"
    filled
    :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
    :disable="configurationStore.isHolidayMode && day.holiday?.isHoliday"
    v-model.number="day.vacationHours"
    v-if="currentSelected.value === selectOptions[2].value"
  >
    <q-btn-dropdown flat dense class="button-dropdown" size="md">
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left :name="currentSelected.icon" />
        </div>
      </template>
      <q-list class="list">
        <q-item
          v-for="sel in selectOptionsRef"
          clickable
          v-close-popup
          @click="selectOption(sel)"
        >
          <q-item-section class="item-section">
            <q-icon :name="sel.icon" size="20px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="q-pt-xs">{{ t(sel.label) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-input>

  <q-input
    class="day-input"
    type="number"
    filled
    :color="configurationStore.isDarkMode ? 'blue-grey' : 'blue'"
    :disable="configurationStore.isHolidayMode && day.holiday?.isHoliday"
    v-model.number="day.sicknessHours"
    v-if="
      selectOptionsRefContains('sick') &&
      currentSelected.value === selectOptions[3].value &&
      configurationStore.isSicknessMode
    "
  >
    <q-btn-dropdown flat dense class="button-dropdown" size="md">
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left :name="currentSelected.icon" />
        </div>
      </template>
      <q-list class="list">
        <q-item
          v-for="sel in selectOptionsRef"
          clickable
          v-close-popup
          @click="selectOption(sel)"
        >
          <q-item-section class="item-section">
            <q-icon :name="sel.icon" size="20px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="q-pt-xs">{{ t(sel.label) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-input>
</template>
<script setup lang="ts">
import { IDayModel } from "@/models/month-model";
import useConfigurationStore from "@/stores/useConfigurationStore";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

defineProps<{ day: IDayModel }>();

const configurationStore = useConfigurationStore();

const { t } = useI18n();

interface SelectOption {
  label: string;
  value: string;
  icon: string;
}

const selectOptions: Array<SelectOption> = [
  { label: "work", value: "Hours", icon: "o_schedule" },
  { label: "break", value: "Break", icon: "o_lunch_dining" },
  { label: "vacation", value: "Vacation", icon: "o_beach_access" },
  { label: "sick", value: "Sickness", icon: "o_sick" },
];

const selectOptionsRefContains = (label: string) => {
  return selectOptions.find((curr) => curr.label === label) ? true : false;
}

const selectOptionsRef = computed(() => {
  let temp = selectOptions;
  if (!configurationStore.isSicknessMode) {
    temp = temp.filter((select) => select.label !== "sick");
  }

  if(!configurationStore.allowBreakInput){
    temp = temp.filter((select) => select.label !== "break");
  }

  return temp;
});

const currentSelected = ref(selectOptions[0]);

const selectOption = (selectedOption: {
  label: string;
  value: string;
  icon: string;
}) => {
  currentSelected.value = selectedOption;
};
</script>
<style lang="scss">
.q-btn-dropdown__arrow {
  margin-left: 0px !important;
}

.item-section {
  flex: none;
  padding-right: 15px;
}

.button-dropdown {
  left: 10px;
}

.list {
  width: 125px;
}
</style>
