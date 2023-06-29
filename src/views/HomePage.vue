<template>
  <ion-page v-if="route.path != '/login'">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('home') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            <span v-if="user" id="helloText">{{ $t('hello', { name: user?.name }) }}</span>
          </ion-title>
          <ion-buttons slot="primary">
            <ion-button>
              <ion-icon slot="icon-only" :icon="notificationsOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <carousel :items-to-show="1">
        <slide v-for="deck in decks" :key="deck.id">
          <TodayChart v-if="deck.stats" :title="deck.name" :stats="deck.stats" />
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
      <ion-list class="duelList" :inset="true">
        <ion-list-header>
          <ion-label>{{ $t('duels') }}</ion-label>
        </ion-list-header>
        <div v-if="duels.length > 0">
          <ion-item v-for="duel in  duels " :key="duel.id" @click="router.push('/duel/' + duel.id);">
            <div slot="start">
              <user-avatar class="small avatar" :userProfile="duel?.users[0]" />
            </div>
            <ion-label>
              <h3>{{ duel.name }}</h3>
              <p>{{ duel.deck.name }}</p>
            </ion-label>
            <div slot="end">
              <user-avatar class="small avatar" :userProfile="duel?.users[1]" />
            </div>
          </ion-item>
        </div>
        <div style="padding: 25px" v-else>
          {{ $t('noDuels') }}
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonLabel, IonItem, IonList, IonListHeader } from '@ionic/vue';
import TodayChart from '@/components/Home/TodayChart.vue';
import UserAvatar from '@/components/Base/UserAvatar.vue';
import { useLearnStatistics } from '@/composables/LearnStatistics'
import { computed, watch, onBeforeMount } from 'vue';
import { db } from '@/plugins/firebase';
import { useCollection } from 'vuefire'
import {
  collection,
  doc,
  query,
  where,
} from "firebase/firestore";
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/plugins/pinia/users';
import { notificationsOutline } from "ionicons/icons";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const decks = useCollection(collection(db, 'decks'));
const currentUserDoc = doc(db, "users", userStore.getLoggedInUserProfile.id);
const duels = useCollection(query(collection(db, "duels"), where("done", "==", false), where("users", "array-contains", currentUserDoc)));
const user = computed(() => userStore.getLoggedInUserProfile);
watch(decks, () => {
  decks.value.forEach(async deck => {
    deck.stats = await useLearnStatistics(deck.id);
  });
})
onBeforeMount(async () => {
  await decks.value.forEach(async deck => {
    deck.stats = await useLearnStatistics(deck.id);
  });

});
</script>
<style scoped>
.carousel__pagination {
  padding: 0;
}

#avatar {
  margin-left: 15px;
}

#helloText {
  font-size: 28px;
}

ion-list.duelList {
  padding-bottom: 16px;
}
</style>
