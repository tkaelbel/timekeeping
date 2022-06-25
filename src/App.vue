<template>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<style lang="scss">
// Overwriting quasar variables, because sass file not working
body.body--dark {
  // line-height: 1.75em !important;
  // font-size: 16px !important;
  background-color: #343434 !important;
  color: white !important;
}

.dark-primary {
  background-color: #354348 !important;
}

.dark-primary-color {
  color: #354348 !important;
}

.light-primary-color {
  color: $primary !important;
}

.dark-bg-negative {
  background-color: #831e02 !important;
}

.dark-button {
  background-color: #354348 !important;
  // color: #354348 !important;
  background: #354348 !important;
}

.light-button {
  background-color: $primary !important;
  color: white !important;
  // background: transparent !important;
}

.dark-secondary {
  background-color: #242424 !important;
}
</style>
