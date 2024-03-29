<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close">{{ $t('close') }}</ion-button>
        </ion-buttons>
        <ion-title>{{ $t('summary') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div style="margin-top: 50px">
        <Doughnut v-if="data" :data="data" :options="options" />
      </div>
      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>{{ $t('cards') }}</ion-label>
        </ion-list-header>
        <ion-item v-for="card in statistics?.cards.filter((card) => card.result <= 2)" :key="card.id">
          <span :class="[{ 'right': card.result == 1, 'wrong': card.result == 0 }, 'status']"></span>
          <div v-html="card.question"></div>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonList,
  IonListHeader,
  IonLabel
} from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';
import { db } from '@/plugins/firebase';
import { doc } from 'firebase/firestore';
import { useDocument } from 'vuefire';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
ChartJS.register(ArcElement, Tooltip)
const props = defineProps(["id", "modalcontroller"]);
const { t } = useI18n();
const router = useRouter();
const statistics = ref();
const data = ref();
const options = {
  responsive: true,
  maintainAspectRatio: false
};

onBeforeMount(async () => {
  const { data: statisticsData, promise } = useDocument(doc(db, "statistics", props.id));
  promise.value.then(() => {
    statistics.value = statisticsData.value;
    const wrongCount = statistics?.value?.cards.filter((card) => card.result == 0).length;
    const rightCount = statistics?.value?.cards.filter((card) => card.result == 1).length;
    const skippedCards = statistics?.value?.cards.filter((card) => card.result == 2).length;
    data.value = {
      labels: [t('wrong'), t('right'), t('skipped')],
      datasets: [
        {
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', '#ccc'],
          data: [wrongCount, rightCount, skippedCards]
        }
      ]
    }
  });
});

const close = () => {
  router.push('/decks');
}

</script>
<style scoped>
.status {
  min-width: 5px;
  height: 100%;
  margin-right: 5px;
  background: #ccc;
}

.status.right {
  background: rgba(75, 192, 192, 1);
}

.status.wrong {
  background: rgba(255, 99, 132, 1);
}
</style>