import { Quasar } from "quasar";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css";

// Import Quasar css
import "quasar/dist/quasar.css";

const app = createApp(App);

app.use(createPinia());

app.use(Quasar, {
  plugins: {},
});

app.use(router);

app.mount("#app");
