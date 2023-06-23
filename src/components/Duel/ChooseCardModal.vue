<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
        </ion-buttons>
        <ion-title>{{ $t('ceateDuel') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="save">{{ $t('create') }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>{{ $t('cards') }}</ion-label>
        </ion-list-header>
        <ion-item v-for="card in cards" :key="card.id" @click="chooseCard(card)">
          {{ card.question }}
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonButtons,
  IonButton,
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonList,
  IonListHeader,
  IonLabel,
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';

const props = defineProps(["modalController", "cards"]);
const selectedCard = ref();
const chooseCardModal = ref();
const chooseCard = (card) => {
  selectedCard.value = card;
  close();
}

const close = () => {
  props.modalController.dismiss(selectedCard, 'cancel');
}
</script>