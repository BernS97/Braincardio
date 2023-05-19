<template>
  <ion-page style="--background: green">
    <ion-content :fullscreen="true">
    <div class="emojiArea">
      <div class="emojiCircle">
        <p class="emoji">
            &#128512;
        </p>
      </div>
      <div class="userData">
        <h1>FelipeB</h1>
        <h2>albertohase@gmx.de</h2>
      </div>
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
        <ion-item>
          <ion-label>{{ $t('friends') }}</ion-label>
          <user-avatars-list>
          
          </user-avatars-list>
        </ion-item>
    </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonAvatar, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/vue';
import { notificationsOutline } from 'ionicons/icons';
import UserAvatarsList from '@/components/Base/UserAvatarsList.vue';

</script>

<style scoped>

ion-avatar {
  width: 32px;
  height: 32px;
}

.emojiArea {
  margin-top: 40px;
}
.emojiCircle {
  height: 200px; 
  width: 200px; 
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: linear-gradient(to right, #373b44, #4286f4);
}
.emoji {
  text-align: center;
  margin: auto;
  font-size: 75px;
  padding: 25%;
}

.userData {
  text-align: center;
}
</style>