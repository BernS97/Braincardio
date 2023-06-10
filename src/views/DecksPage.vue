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
        <ion-toolbar>
          <ion-searchbar :debounce="20" @keydown="handleSearch($event.target.value.toLowerCase())" :animated="true"
            :placeholder="$t('search')"></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <deck-card v-for="deck in searchDecks" :key="deck.id" :deck="deck" />
      <ion-fab>
        <ion-fab-button @click="router.push('/decks/create')">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonAvatar, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, IonButton, IonButtons, IonFab, IonFabButton, IonSearchbar } from '@ionic/vue';
import { ref, watch } from "vue";
import { notificationsOutline, add } from 'ionicons/icons';
import { useCollection } from "vuefire";
import { db } from "@/plugins/firebase.js"
import { useRouter } from 'vue-router';
import { useUserStore } from '@/plugins/pinia/users';
import {
  collection,
  doc,
  query,
  where,
} from "firebase/firestore";
import DeckCard from '@/components/Decks/DeckCard.vue';

const router = useRouter();
const userStore = useUserStore();
const currentUserDoc = doc(db, "users", userStore.getLoggedInUserProfile.id);
const decks = useCollection(query(collection(db, "decks"), where("users", "array-contains", currentUserDoc)));
const searchDecks = ref(decks.value);

watch(decks, () => {
  searchDecks.value = decks.value;
});

const handleSearch = (search) => {
  searchDecks.value = decks.value.filter(d => d.name.toLowerCase().indexOf(search) > -1);
};

</script>

<style scoped>
ion-avatar {
  width: 32px;
  height: 32px;
}

#circle {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background: red;
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
