<template>
  <ion-page ref="page" v-if="userProfile">
    <ion-content :fullscreen="true" :scroll-y="false">
      <div class="userAvatarArea">
        <user-avatar :userProfile="userProfile" :badge="true" @click="openAvatarModal" />
        <div class="userData">
          <h2>{{ userProfile.email }}</h2>
          <h1>{{ userProfile.name }}</h1>
        </div>
      </div>
      <ion-list :inset="true">
        <ion-item>
          <ion-toggle :translucent="true">{{ $t('focusMode') }}</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-select @ionChange="setLanguage" :value="settings.language" :label="$t('language')" label-placement="fixed"
            :aria-label="$t('language')">
            <ion-select-option v-for="lang in languages" :value="lang.val">{{ lang.text }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item button @click="openFriendsModal" expand="block">
          <ion-label>{{ $t("friends") }}</ion-label>
          <user-avatars-list v-if="userProfile.friends.every(value => { return typeof value == 'object' })"
            :users="userProfile.friends" />
        </ion-item>
      </ion-list>
      <ion-button class="logoutButton" expand="block" @click="logOut">
        {{ $t('logout') }}
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonContent,
  IonPage,
  IonButton,
  IonItem,
  IonList,
  IonLabel,
  IonSelect,
  IonToggle,
  modalController,
  IonSelectOption
} from "@ionic/vue";
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import UserAvatarsList from "@/components/Base/UserAvatarsList.vue";
import UserAvatar from "@/components/Base/UserAvatar.vue";
import AvatarModal from "@/components/Base/AvatarModal.vue";
import { useUserStore } from "@/plugins/pinia/users";
import { useRouter } from "vue-router";
import { doc } from "firebase/firestore";
import { db } from "@/plugins/firebase";
import { useDocument } from "vuefire";
import FriendsModal from "@/components/FriendRequests/FriendsModal.vue";

const { t, locale } = useI18n();
const userStore = useUserStore();
const userProfile = useDocument(doc(db, "users", userStore.getLoggedInUserProfile.id));
const settings = ref('');
const page = ref();
const router = useRouter();
const languages = [{ val: "en", text: t('english') }, { val: "de", text: t('german') }, { val: "es", text: t('spanish') }]

onBeforeMount(async () => {
  //userProfile = await userStore.fetchLoggedInUserProfile();
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
const openAvatarModal = async () => {
  const modal = await modalController.create({
    component: AvatarModal,
    componentProps: {
      modalController: modalController,
      user: userProfile.value,
    },
    presentingElement: page.value.$el,
  });
  modal.present();
  modal.onWillDismiss()
    .then((image) => {
      userProfile.image = image.data;
    });
}

const openFriendsModal = async () => {
  const modal = await modalController.create({
    component: FriendsModal,
    componentProps: {
      modalController: modalController,
      userProfile: userProfile.value,
    },
    presentingElement: page.value.$el,
  });
  modal.present();
}
</script>

<style scoped>
ion-avatar {
  width: 32px;
  height: 32px;
}

.userAvatarArea {
  height: 350px;
  padding-top: 80px;
  background: linear-gradient(180deg, #216383, var(--ion-background-color, #f9f9f9));
}

.userData {
  text-align: center;
}

.logoutButton {
  margin: 15px;
}

ion-fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: absolute;
  bottom: 75px;
}

h1 {
  margin-top: 0;
  font-weight: 700;
}

h2 {
  color: var(--ion-color-step-550, #737373);
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 0;
  font-weight: 700;
}
</style>
