<template>
  <ion-page ref="page" v-if="userProfile">
    <ion-content :fullscreen="true" :scroll-y="false">
      <div class="userAvatarArea">
        <user-avatar v-if="userProfile" :userProfile="userProfile" :badge="true" @click="openModal" />
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
        <ion-item button id="open-modal" expand="block">
          <ion-label>{{ $t("friends") }}</ion-label>
          <user-avatars-list v-if="userProfile" :users="userProfile.friends"></user-avatars-list>
          <ion-modal ref="modal" trigger="open-modal">
            <ion-page>
              <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-button @click="cancel">{{ $t('cancel') }}</ion-button>
                  </ion-buttons>
                  <ion-title>{{ $t("friends") }}</ion-title>
                </ion-toolbar>
              </ion-header>
              <ion-content class="ion-padding">
                <ion-list :inset="true">
                  <ion-list-header>
                    <ion-label>{{ $t("friends") }}</ion-label>
                  </ion-list-header>
                  <div v-if="userProfile?.friends?.length > 0">
                    <ion-item-sliding v-for="(user, idx) in userProfile?.friends" :key="user?.id">
                      <ion-item>
                        <div slot="start" v-if="user?.image">
                          <user-avatar class="small avatar" :userProfile="user" />
                        </div>
                        <ion-label>{{ user?.name }}</ion-label>
                      </ion-item>
                      <ion-item-options>
                        <ion-item-option color="danger" @click="removeFriend(user)">{{ $t("delete") }}</ion-item-option>
                      </ion-item-options>
                    </ion-item-sliding>
                  </div>
                  <div v-else style="margin: 15px;">
                    {{ $t("noFriends") }}
                  </div>
                </ion-list>
                <ion-list :inset="true">
                  <ion-list-header>
                    <ion-label>
                      {{ $t("addFriends") }}
                    </ion-label>
                  </ion-list-header>
                  <ion-item>
                    <ion-input :placeholder="$t('enterFriendsUsername')" @ionInput="userName = $event.target.value" />
                    <ion-button @click="addFriend" slot="end" :disabled="userName === ''">{{ $t("add") }}</ion-button>
                  </ion-item>
                </ion-list>
                <friends-request-list :currentUserDoc="currentUserDoc" />
              </ion-content>
            </ion-page>
          </ion-modal>
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
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonListHeader,
  IonLabel,
  IonSelect,
  IonToggle,
  IonButtons,
  IonTitle,
  IonModal,
  modalController,
  IonToolbar,
  IonHeader,
  IonInput,
  IonSelectOption
} from "@ionic/vue";
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import UserAvatarsList from "@/components/Base/UserAvatarsList.vue";
import UserAvatar from "@/components/Base/UserAvatar.vue";
import AvatarModal from "@/components/Base/AvatarModal.vue";
import FriendsRequestList from "@/components/FriendRequests/FriendsRequestList.vue";
import { useUserStore } from "@/plugins/pinia/users";
import { useRouter } from "vue-router";
import { collection, doc, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from "@/plugins/firebase";
import { useCollection } from "vuefire";

const { t, locale } = useI18n();
const userStore = useUserStore();
const userProfile = ref();
const userName = ref('');
const settings = ref('');
const page = ref();
const router = useRouter();
const languages = [{ val: "en", text: t('english') }, { val: "de", text: t('german') }, { val: "es", text: t('spanish') }]
const currentUserDoc = doc(db, "users", userStore.getLoggedInUserProfile.id);

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
  router.push("/login");
};
const addFriend = async () => {
  if (userName.value === userProfile.value)
    console.log("Adding own user is not possible."); //TODO: at toast message.
  else {
    const { data: users, promise } = useCollection(
      query(collection(db, "users"), where("name", "==", userName.value)) //TODO(!) this does not work!
    );
    await promise.value;
    const friend = users.value[0];
    if (friend) {
      const friendRequest = {
        approved: null,
        from: doc(db, "users", userProfile.id),
        to: doc(db, "users", friend.id),
      };
      addDoc(collection(db, "friendRequests"), friendRequest);
      console.log("Sent."); //TODO: at toast message.
    }
  }
};
const removeFriend = async (friend) => {

  //add friends;
  userProfile.value.friends = userProfile.value.friends.filter((user) => user.id !== friend.id);
  const userProfileFriends = userProfile.value.friends.map((user) => {
    if (user.id) return doc(db, "users", user.id);
  });

  friend.friends = friend.friends.filter((user) => user.id !== userProfile.value.id);
  const removeUserFriends = friend.friends.map((user) => {
    if (user.id) return doc(db, "users", user.id);
  });

  await updateDoc(doc(db, "users", friend.id), { friends: removeUserFriends });
  await updateDoc(doc(db, "users", userProfile.value.id), { friends: userProfileFriends });

};
const openModal = async () => {
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
const cancel = () => {
  return modalController.dismiss(null);
};
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
