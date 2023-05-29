<template>
  <ion-page ref="page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/decks" />
        </ion-buttons>
        <ion-title>
          <span v-if="deck">{{ deck.name }}</span>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="router.push('/decks/edit/' + id)">
            {{ $t('edit') }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar :debounce="20" @keydown="handleChange($event)" :animated="true"
          :placeholder="$t('search')"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" v-if="deck">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            <span v-if="deck">{{ deck.name }}</span>
          </ion-title>

        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar :debounce="20" @keydown="handleChange($event)" :animated="true"
            :placeholder="$t('search')"></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <ion-list :inset="true" v-if="deck">
        <ion-list-header>
          <ion-label>{{ $t('general') }}</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>
            {{ $t('subject') }}
          </ion-label>
          {{ deck.subject }}
        </ion-item>
        <ion-item>
          <ion-label>
            {{ $t('lecturer') }}
          </ion-label>
          {{ deck.lecturer }}
        </ion-item>
      </ion-list>
      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>{{ $t('users') }}</ion-label>
        </ion-list-header>
        <ion-item v-for="user in deck.users" :key="user.id">
          <user-avatar class="small" :userProfile="user" />
          {{ user.name }}
        </ion-item>
      </ion-list>
      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>{{ $t('cards') }}</ion-label>
          <ion-button @click="router.push('/learn/' + id)">{{ $t('learn') }}</ion-button>
        </ion-list-header>
        <ion-item v-for="card in searchCards" :key="card">
          <ion-label>
            <div v-html="card.question"></div>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonButton, IonButtons, IonBackButton, IonSearchbar } from '@ionic/vue';
import { watch, ref } from 'vue';
import { useRouter } from "vue-router";
import { db } from '@/plugins/firebase';
import { useDocument } from 'vuefire';
import { doc } from 'firebase/firestore';
import UserAvatar from '@/components/Base/UserAvatar.vue';

const props = defineProps(["id"]);
const deck = useDocument(doc(db, "decks", props.id));
const searchCards = ref(null);
const router = useRouter();
const handleChange = (event) => {
  const search = event.target.value.toLowerCase();
  searchCards.value = deck.value.cards.filter(d => d.question.toLowerCase().indexOf(search) > -1);
};

watch(deck, () => {
  searchCards.value = deck.value.cards
})

</script>
<style>
.header-collapse-condense-inactive:not(.header-collapse-condense) ion-toolbar.toolbar-searchbar {
  display: none;
}
</style>