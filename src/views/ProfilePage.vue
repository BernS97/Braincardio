<template>
  <ion-page style="--background: green">
    <ion-content :fullscreen="true">
      <div class="userAvatarArea">
        <user-avatar v-if="userProfile" :userProfile="userProfile" :badge="true" />
      </div>
      <div class="userData">
        <h1>{{ userProfile.name }}</h1>
        <h2>{{ userProfile.email }}</h2>
      </div>
      <ion-list :inset="true">
        <ion-item>
          <ion-toggle :translucent="true">Focus Mode</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-select @ionChange="setLanguage" :value="settings.language" :label="$t('language')" label-placement="fixed"
            :aria-label="$t('language')">
            <ion-select-option v-for="lang in languages" :value="lang.val">{{ lang.text }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item button>
          <ion-label>{{ $t('friends') }}</ion-label>
          <user-avatars-list v-if="userProfile" :users="userProfile.friends">
          </user-avatars-list>
        </ion-item>
      </ion-list>
      <ion-button class="logoutButton" expand="block" @click="logOut">Logout</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonContent, IonPage, IonButton, IonSelect, IonSelectOption, IonItem, IonList, IonToggle, IonLabel } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';
import UserAvatarsList from '@/components/Base/UserAvatarsList.vue';
import UserAvatar from '@/components/Base/UserAvatar.vue';
import { useUserStore } from '@/plugins/pinia/users';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const userStore = useUserStore();
const userProfile = ref('');
const settings = ref('');
const router = useRouter();
const languages = [{ val: "en", text: t('english') }, { val: "de", text: t('german') }, { val: "es", text: t('spanish') }]

onBeforeMount(async () => {
  userProfile.value = await userStore.fetchLoggedInUserProfile();
  settings.value = await userStore.getSettings;
});

const logOut = () => {
  userStore.logOut();
  router.push('/login');
}

const setLanguage = (event) => {
  const lang = event.detail.value;
  locale.value = lang;
  userStore.setLanguage(lang);
};
</script>

<style scoped>
ion-avatar {
  width: 32px;
  height: 32px;
}

.userAvatarArea {
  margin-top: 80px;
}

.userData {
  text-align: center;
}

.logoutButton {
  margin: 15px;
}
</style>