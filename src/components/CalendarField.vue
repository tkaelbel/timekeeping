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
    <q-btn-dropdown flat dense class="button-dropdown" size="sm">
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
            <q-item-label class="q-pt-xs">{{ sel.label }}</q-item-label>
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
    v-if="currentSelected.value === selectOptions[1].value"
  >
    <q-btn-dropdown flat dense class="button-dropdown" size="sm">
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
            <q-item-label class="q-pt-xs">{{ sel.label }}</q-item-label>
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
      selectOptionsRef.length == 3 &&
      currentSelected.value === selectOptions[2].value &&
      configurationStore.isSicknessMode
    "
  >
    <q-btn-dropdown flat dense class="button-dropdown" size="sm">
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
            <q-item-label class="q-pt-xs">{{ sel.label }}</q-item-label>
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

const selectOptions = [
  { label: t("work"), value: "Hours", icon: "o_schedule" },
  { label: t("vacation"), value: "Vacation", icon: "o_beach_access" },
  { label: t("sick"), value: "Sickness", icon: "o_sick" },
];

const selectOptionsRef = computed(() => {
  const temp = selectOptions;
  if (!configurationStore.isSicknessMode) {
    temp.splice(-1);
    return temp;
  }

  return selectOptions;
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
