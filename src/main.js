import App from "@/App.vue";
import createRouter from "@/plugins/router";
import { createApp } from "vue";

import { IonicVue } from "@ionic/vue";
import { createPinia } from "pinia";

import deLocale from "@/locales/de.json";
import enLocale from "@/locales/en.json";
import esLocale from "@/locales/es.json";
import { createI18n } from "vue-i18n";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/display.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";

/* Theme variables */
import "@/assets/styles/variables.css";

const i18n = createI18n({
  locale: "en",
  allowComposition: true, // you need to specify that!
  messages: {
    en: enLocale,
    de: deLocale,
    es: esLocale,
  },
  legacy: false,
});

const pinia = createPinia();
const router = createRouter(pinia);

const app = createApp(App).use(IonicVue).use(pinia).use(i18n).use(router);

router.isReady().then(() => {
  app.mount("#app");
});
