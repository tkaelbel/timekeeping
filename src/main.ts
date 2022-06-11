import { Quasar } from "quasar";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css";

// import quasarIconSet from "quasar/icon-set/svg-material-icons";

import "flag-icons";

// Import Quasar css
import "quasar/dist/quasar.css";

import de from "./locales/de.json";
import en from "./locales/en.json";
import { createI18n, IntlDateTimeFormat } from "vue-i18n";

const datetimeFormats: { [x: string]: IntlDateTimeFormat } = {
  en: {
    month: {
      month: "short",
    },
    weekday: {
      day: "2-digit",
      month: "2-digit",
    },
    day: {
      weekday: "long",
    },
  },
  de: {
    month: {
      month: "short",
    },
    weekday: {
      day: "2-digit",
      month: "2-digit",
    },
    day: {
      weekday: "long",
    },
  },
};

const numberFormats = {
  en: {
    decimal: {
      style: "decimal",
      maximumFractionDigits: 2,
    },
  },
  de: {
    decimal: {
      style: "decimal",
      maximumFractionDigits: 2,
    },
  },
};

const app = createApp(App);

app.use(createPinia());

app.use(Quasar, {
  plugins: {},
  // quasarIconSet: quasarIconSet,
});

app.use(router);

const i18n = createI18n({
  locale: "en",
  datetimeFormats,
  numberFormats,
  messages: {
    en,
    de,
  },
});

app.use(i18n);

app.mount("#app");
