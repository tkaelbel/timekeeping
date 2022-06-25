<template>
  <q-dialog v-model="show" seamless position="bottom">
    <q-card style="width: 250px" :class="getColor">
      <q-card-section class="row items-center no-wrap text-center">
        <div class="col">
          <span class="col text-h5 text-white">{{ message }}</span>
          <q-icon
            class="col text-white q-pb-xs q-pl-sm"
            :name="isPositive ? 'verified' : 'highlight_off'"
            size="xl"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import useConfigurationStore from "@/stores/useConfigurationStore";
import usePopupStore from "@/stores/usePopupStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { isPositive, message, show } = storeToRefs(usePopupStore());
const { isDarkMode } = storeToRefs(useConfigurationStore());

const getColor = computed(() => {
  if (isPositive.value && isDarkMode.value) return "dark-primary";
  if (isPositive.value && !isDarkMode.value) return "bg-positive";
  if (!isPositive.value && isDarkMode.value) return "dark-bg-negative";
  if (!isPositive.value && !isDarkMode.value) return "bg-negative";
});
</script>
