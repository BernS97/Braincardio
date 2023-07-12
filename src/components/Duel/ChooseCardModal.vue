<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
        </ion-buttons>
        <ion-title>{{ $t('chooseCard') }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar :debounce="20" @keydown="handleSearch($event.target.value.toLowerCase())" :animated="true"
          :placeholder="$t('search')"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar slot="start">
          <ion-title size="large">{{ $t('cards') }}</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar :debounce="20" @keydown="handleSearch($event.target.value.toLowerCase())" :animated="true"
            :placeholder="$t('search')"></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <ion-card v-for="card in searchCards" :key="card.id" @click="chooseCard(card)">
        <ion-card-content>
          <div v-html="card.question"></div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonButtons,
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonSearchbar
} from '@ionic/vue';
import { ref } from 'vue';

const props = defineProps(["modalController", "cards"]);
const selectedCard = ref();
const searchCards = ref(props.cards);
const chooseCard = (card) => {
  selectedCard.value = card;
  close();
}

const handleSearch = (search) => {
  searchCards.value = props.cards.filter(d => d.question.toLowerCase().indexOf(search) > -1);
};

const close = () => {
  props.modalController.dismiss(selectedCard, 'cancel');
}
</script>