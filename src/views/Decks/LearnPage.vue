<template>
  <ion-page v-if="route.fullPath.includes('learn')">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/decks"></ion-back-button>
        </ion-buttons>
        <ion-title>
          <span v-if="deck">{{ deck.title }}</span>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="finishLearn">{{ $t('done') }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-progress-bar :value="progress" />
    </ion-header>
    <ion-content v-if="learnObj" :fullscreen="true">
      <LearnCarousel v-if="deck?.cards" :cards="deck?.cards" :total="total" @cardAccepted="handleCardAccepted"
        @previous="handlePrevious" @cardRejected="handleCardRejected" @cardSkipped="handleCardSkipped" />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonProgressBar, IonButtons, IonButton, IonBackButton } from '@ionic/vue';
import { computed, ref, watch, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import LearnCarousel from "@/components/Learn/LearnCarousel.vue";
import { cloneDeep } from 'lodash-es';
//stores
import { useLearnObjStore } from '@/plugins/pinia/learn';
import { useStatisticsStore } from '@/plugins/pinia/statistics';
import { useUserStore } from '@/plugins/pinia/users';
import { useDocument } from 'vuefire';
import { db } from '@/plugins/firebase';
import { doc } from 'firebase/firestore';

const props = defineProps(["id"]);
const learnObjStore = useLearnObjStore();
const statisticsStore = useStatisticsStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const user = userStore.getUser;
const deck = ref();

const learnObj = ref();
const statistics = ref();
const correctCards = ref([]);
const wrongCards = ref([]);
const skippedCards = ref([]);
const total = ref(0);

const current = computed(() => total.value - (total.value - (correctCards.value.length + wrongCards.value.length + skippedCards.value.length)));
const progress = computed(() => current.value / total.value);

watch(progress, () => {
  if (progress.value === 1)
    finishLearn();
});

const handleCardAccepted = async (cardIndex) => {
  const card = learnObj.value?.cards[cardIndex];
  await learnObjStore.handleCardAccepted(cardIndex > 0 ? cardIndex : 0);
  correctCards.value.push(card);
};
const handleCardRejected = async (cardIndex) => {
  const card = learnObj.value?.cards[cardIndex];
  await learnObjStore.handleCardRejected(cardIndex > 0 ? cardIndex : 0);
  wrongCards.value.push(card);
};
const handleCardSkipped = async (cardIndex) => {
  const card = learnObj.value?.cards[cardIndex];
  await learnObjStore.handleCardSkipped(cardIndex > 0 ? cardIndex : 0);
  skippedCards.value.push(card);
};
const handlePrevious = (cardIndex) => {
  const card = learnObj.value?.cards[cardIndex];
  const skippedIndex = skippedCards.value.indexOf(card);
  const wrongIndex = wrongCards.value.indexOf(card);
  const correctIndex = correctCards.value.indexOf(card);
  if (skippedIndex >= 0)
    skippedCards.value.splice(skippedIndex, 1);
  if (wrongIndex >= 0)
    wrongCards.value.splice(wrongIndex, 1);
  if (correctIndex >= 0)
    correctCards.value.splice(correctIndex, 1);
};
const finishLearn = async () => {
  const statisticId = await learnObjStore.getStatisticId;
  router.push('/statistics/' + statisticId);
  skippedCards.value = [];
  correctCards.value = [];
  wrongCards.value = [];
}

const getStatistics = async () => {
  const obj = await statisticsStore.getStatisticsById(props.id);
  let latest = obj?.statistics[0] ?? null;
  if (obj?.statistics && latest) {
    if (obj.statistics.length > 0) {
      obj.statistics.forEach(element => {
        if (element.date > latest.date)
          latest = element;
      });
    }
  }
  statistics.value = cloneDeep(latest);
}

onBeforeMount(async () => {
  await getStatistics();
  const { data: deckData, promise } = await useDocument(doc(db, 'decks', props.id));
  await promise.value;
  deck.value = deckData.value;
  total.value = deck?.value?.cards?.length;
  learnObj.value = await learnObjStore.createLearnObj({
    deckCards: deck?.value.cards,
    statisticsCards: statistics?.value?.cards,
    id: props.id,
    email: user?.data?.email ?? 'testUser',
  });
});

</script>
<style scoped>
ion-content {
  overflow: hidden;
}
</style>
