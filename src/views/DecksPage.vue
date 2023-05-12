<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ $t('decks') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar slot="start">
          <ion-title size="large">{{ $t('decks') }}</ion-title>
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
</style>
