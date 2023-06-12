<template>
  <ion-page style="--background: green">
    <ion-content :fullscreen="true">
      <div class="userAvatarArea">
        <user-avatar
          v-if="userProfile"
          :userProfile="userProfile"
          :badge="true"
        />
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
          <ion-select
            value="en"
            :label="$t('language')"
            label-placement="fixed"
            :aria-label="$t('language')"
          >
            <ion-select-option value="en">{{
              $t("english")
            }}</ion-select-option>
            <ion-select-option value="de">{{ $t("german") }}</ion-select-option>
            <ion-select-option value="es">{{
              $t("spanish")
            }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item button id="open-modal" expand="block">
          <ion-label>{{ $t("friends") }}</ion-label>
          <user-avatars-list
            v-if="userProfile"
            :users="userProfile.friends"
          ></user-avatars-list>
          <ion-modal ref="modal" trigger="open-modal">
            <ion-page>
              <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-button @click="cancel">Cancel</ion-button>
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
                    <ion-item-sliding
                      v-for="(user, idx) in userProfile?.friends"
                      :key="user?.id"
                    >
                      <ion-item>
                        <div slot="start" v-if="user?.image">
                          <user-avatar
                            class="small avatar"
                            :userProfile="user"
                          />
                        </div>
                        <ion-label>{{ user?.name }}</ion-label>
                      </ion-item>
                      <ion-item-options>
                        <ion-item-option
                          color="danger"
                          @click="removeUser(user.id)"
                          >{{ $t("delete") }}</ion-item-option
                        >
                      </ion-item-options>
                    </ion-item-sliding>
                  </div>
                  <div v-else>
                    {{ $t("noFriends") }}
                  </div>
                </ion-list>
                <friends-request-list :currentUserDoc="currentUserDoc" />
                <ion-fab>
                  <ion-fab-button id="modal-friends" expand="block">
                    <ion-icon :icon="add"></ion-icon>
                  </ion-fab-button>
                </ion-fab>
                <ion-modal ref="modal-friends" trigger="modal-friends">
                  <ion-page>
                    <ion-header>
                      <ion-toolbar>
                        <ion-buttons slot="start">
                          <ion-button @click="cancel">Cancel</ion-button>
                        </ion-buttons>
                        <ion-title>{{ $t("addFriends") }}</ion-title>
                      </ion-toolbar>
                    </ion-header>
                  </ion-page>
                </ion-modal>
              </ion-content>
            </ion-page>
          </ion-modal>
        </ion-item>
      </ion-list>
      <ion-button class="logoutButton" expand="block" @click="logOut"
        >Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonFab,
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
  IonFabButton,
  IonSearchbar,
} from "@ionic/vue";
import { onBeforeMount, ref } from "vue";
import { add } from "ionicons/icons";
import UserAvatarsList from "@/components/Base/UserAvatarsList.vue";
import UserAvatar from "@/components/Base/UserAvatar.vue";
import FriendsRequestList from "@/components/FriendRequests/FriendsRequestList.vue";
import { useUserStore } from "@/plugins/pinia/users";
import { useRouter } from "vue-router";
import { doc } from "firebase/firestore";
import { db } from "@/plugins/firebase";

const userStore = useUserStore();
const userProfile = ref("");
const router = useRouter();
const currentUserDoc = doc(db, "users", userStore.getLoggedInUserProfile.id);

onBeforeMount(async () => {
  userProfile.value = await userStore.fetchLoggedInUserProfile();
});

const logOut = () => {
  userStore.logOut();
  router.push("/login");
};

const cancel = () => {
  return modalController.dismiss(null, "cancel");
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

ion-fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: absolute;
  bottom: 75px;
}
</style>
