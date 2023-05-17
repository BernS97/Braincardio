<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ $t('profile') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar slot="start">
          <ion-title size="large">{{ $t('profile') }}</ion-title>
          <ion-buttons slot="primary">
            <ion-button>
              <ion-icon slot="icon-only" :icon="notificationsOutline"></ion-icon>
            </ion-button>
            <ion-button>
              <ion-avatar>
                <img alt="Silhouette of a person's head"
                  src="https://erp-information.de/wp-content/uploads/2022/10/breitsch.png" />
              </ion-avatar>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
    <div class="emojiArea">
      <div class="emojiCircle">
        <p class="emoji">
            &#128512;
        </p>
      </div>
      <div class="userData">
        <h1>
        FelipeB
      </h1>
      <h2>
        albertohase@gmx.de
      </h2>
      </div>
    </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonAvatar, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/vue';
import { notificationsOutline } from 'ionicons/icons';


</script>

<style scoped>

ion-avatar {
  width: 32px;
  height: 32px;
}

.emojiArea {

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
