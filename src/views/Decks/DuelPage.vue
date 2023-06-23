<template>
  <ion-page ref="page">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>
          <span v-if="duel">{{ duel?.name }}</span>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <duel-done-card v-if="duel?.done" :duel="duel" />
    <duel-lobby-page v-if="!ready && !duel?.done" :duel="duel" :actives="actives" />
    <duel-answer-card v-if="ready && !duel?.done && myTurn && currentTurn?.card && currentTurn.userAnswer == null"
      :duel="duel" :currentTurn="currentTurn" :myTurn="myTurn" @answerCard="answerCard" />
    <duel-rate-answer-card
      v-if="ready && !myTurn && currentTurn?.card && currentTurn.userAnswer != null && currentTurn.result != 0 && currentTurn.result != 1"
      :duel="duel" :currentTurn="currentTurn" :myTurn="myTurn" @setCardResult="setCardResult" :oponent="oponent" />
    <loading-pop-up v-if="rateLoading" text="Waiting for rating" />
    <loading-pop-up v-if="answerLoading" text="Waiting for answering" />
    <loading-pop-up v-if="cardLoading" text="Waiting for card" />
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, modalController } from '@ionic/vue';
import { defineComponent, onBeforeMount, computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDocument } from "vuefire";
import { db } from "@/plugins/firebase";
import { doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '@/plugins/pinia/users';
import ChooseCardModal from "@/components/Duel/ChooseCardModal.vue";
import DuelAnswerCard from "@/components/Duel/DuelAnswerCard.vue";
import DuelRateAnswerCard from "@/components/Duel/DuelRateAnswerCard.vue";
import DuelDoneCard from "@/components/Duel/DuelDoneCard.vue";
import LoadingPopUp from "@/components/Base/LoadingPopUp.vue";
import DuelLobbyPage from "@/components/Duel/DuelLobbyPage.vue";
const props = defineProps(["id"]);
const router = useRouter();
const page = ref();
const actives = ref([]);
const userStore = useUserStore();
const userId = userStore.getLoggedInUserProfile.id;
const oponent = ref();
const { data: duel, promise } = useDocument(doc(db, "duels", props.id));

const hasCard = computed(() => {
  return currentTurn?.value?.card != null;
});
const rateLoading = computed(() => {
  return ready.value && myTurn.value && currentTurn.value?.card && currentTurn.value.userAnswer != null && currentTurn.value.result != 0 && currentTurn.value.result != 1;
});
const answerLoading = computed(() => {
  return ready.value && !duel?.value?.done && !myTurn.value && currentTurn?.value?.card && currentTurn?.value?.userAnswer == null;
});
const cardLoading = computed(() => {
  return ready.value && !duel?.value?.done && myTurn.value && !hasCard.value;
});
const currentTurn = computed(() => {
  return duel?.value?.turns ? duel?.value?.turns[duel?.value?.turns?.length - 1] : null;
});
const remainingTurns = computed(() => {
  return duel?.value?.cardAmount - (duel?.value?.turns?.length - 1);
});
const ready = computed(() => { return duel?.value?.actives?.filter((el) => el.ready == true)?.length == 2 });
const myTurn = computed(() => { return duel?.value?.turns && currentTurn.value?.userId == userId });

watch(remainingTurns, () => {
  if (remainingTurns.value == 0) {
    duel.value.done = true;
    updateDuel({
      done: duel.value.done
    });
  }
})

watch(ready, () => {
  if (ready.value == true)
    promise.value.then(() => {
      if (!duel?.value?.done)
        startGame();
    });
})

watch(duel, () => {
  if (myTurn.value && currentTurn?.value?.card && (currentTurn?.value?.result === 0 || currentTurn?.value?.result === 1) && !duel.value.done)
    startGame();
})

const startGame = () => {
  const chooser = duel?.value?.turns.length > 0 ? currentTurn?.value?.userId : duel.value.users[duel.value.starter].id
  if (chooser == userId && !duel.value.done) {//decides who starts
    addTurn(null);
    chooseCard();
  }
};

const updateDuel = async (update) => {
  updateDoc(doc(db, "duels", props.id), update);
}

const chooseCard = async () => {
  const modal = await modalController.create({
    component: ChooseCardModal,
    componentProps: {
      modalController: modalController,
      cards: duel?.value?.deck?.cards
    },
    breakpoints: [0, 0.3, 0.5, 0.8, 1],
    initialBreakpoint: 1.0,
    presentingElement: page.value.$el,
  });
  modal.present();
  const { data } = await modal.onDidDismiss();
  if (data) {
    editTurn(data.value);
  }
}

const answerCard = (answer) => {
  currentTurn.value.userAnswer = answer;
  updateDuel({
    turns: duel.value.turns
  });
}

const setCardResult = (result) => {
  currentTurn.value.result = result;
  if (remainingTurns.value == 1)
    duel.value.done = true
  updateDuel({
    turns: duel.value.turns,
    done: duel.value.done
  });
}

const editTurn = (card) => {
  //choose card
  currentTurn.value.card = card;
  updateDuel({
    turns: duel.value.turns
  });
}

const addTurn = (card) => {
  //choose card
  duel.value.turns.push({
    userId: oponent.value.id,
    card: card,
    result: null,
  });
  updateDuel({
    turns: duel.value.turns
  });
}

onBeforeMount(() => {
  promise.value.then(() => {
    oponent.value = duel.value.users.find(el => el.id != userId);
    actives.value = duel.value.actives.map((active) => {
      if (active.userId == userStore.getLoggedInUserProfile.id && !active.ready)
        active.ready = true;
      return active;
    })
    updateDuel({
      actives: duel.value.actives
    })
  })
})
</script>
<style lang="scss">
ion-content {
  height: calc(100% - 84px);
}

.user {
  padding: 21%;
  filter: blur(30px);

  &.ready {
    filter: blur(0);
  }
}

ion-spinner {
  z-index: 10000;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75px;
  bottom: 50%;

}
</style>
