<template>
  <ion-page v-if="route.path != '/login'">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('home') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="false">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            <span v-if="user" id="helloText">{{ $t('hello', { name: user?.name }) }}</span>
          </ion-title>
          <ion-buttons slot="primary">
            <img class="navLogo" src="@/assets/images/logo.png" alt="logo">
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
        <div v-if="duels.length > 0" id="duelList">
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

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const currentUserDoc = doc(db, "users", userStore.getLoggedInUserProfile.id);
const decks = useCollection(query(collection(db, "decks"), where("users", "array-contains", currentUserDoc)));
const duels = useCollection(query(collection(db, "duels"), where("done", "==", false), where("users", "array-contains", currentUserDoc)));
const user = computed(() => userStore.getLoggedInUserProfile);
watch(decks, () => {
  decks.value.forEach(async deck => {
    deck.stats = await useLearnStatistics(deck.id);
  });
})

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

ol.carousel__track {
  margin-block-start: 0;
  margin-block-end: 0;
}

.carousel__pagination {
  margin: 0;
}

.carousel__slide ion-card {
  margin-bottom: 0;
}

#duelList {
  max-height: 175px;
  overflow: scroll;
}
</style>
