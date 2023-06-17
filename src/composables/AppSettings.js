import { useUserStore } from "@/plugins/pinia/users";
import { useI18n } from "vue-i18n";

// by convention, composable function names start with "use"
export async function applySettings(doc) {
  const userStore = useUserStore();
  const { locale } = useI18n();
  const settings = userStore.getSettings;
  locale.value = settings.language;
}
