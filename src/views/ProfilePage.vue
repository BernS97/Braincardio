<template>
  <ion-page style="--background: green">
    <ion-content :fullscreen="true">
      <div class="emojiArea">
        <user-avatar :userProfile="userProfile" :badge="true" />
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
          <ion-select value="en" :label="$t('language')" label-placement="fixed" :aria-label="$t('language')">
            <ion-select-option value="en">{{ $t('english') }}</ion-select-option>
            <ion-select-option value="de">{{ $t('german') }}</ion-select-option>
            <ion-select-option value="es">{{ $t('spanish') }}</ion-select-option>
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
import { IonContent, IonPage, IonButton } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';
import UserAvatarsList from '@/components/Base/UserAvatarsList.vue';
import UserAvatar from '@/components/Base/UserAvatar.vue';
import { useUserStore } from '@/plugins/pinia/users';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const userProfile = ref('');
const router = useRouter();


onBeforeMount(async () => {
  userProfile.value = await userStore.fetchLoggedInUserProfile();
});

const logOut = () => {
  userStore.logOut();
  router.push('/login');
}
</script>

<style scoped>
ion-avatar {
  width: 32px;
  height: 32px;
}

.emojiArea {
  margin-top: 40px;
}

.userData {
  text-align: center;
}

.logoutButton {
  margin: 15px;
}
</style>