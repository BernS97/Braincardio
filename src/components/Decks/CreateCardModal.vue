<template>
  <ion-modal ref="modal" :trigger="trigger">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel()">{{ $t('cancel') }}</ion-button>
        </ion-buttons>
        <ion-title>{{ $t('createCard') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="addCard">{{ $t('add') }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment :value="selectedSegment" @ionChange="selectedSegment = $event.detail.value;">
          <ion-segment-button value="question">
            <ion-label>{{ $t('question') }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="answer">
            <ion-label>{{ $t('answer') }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <card-editor v-show="selectedSegment == 'question'" v-model="question" :placeholder="$t('question')" />
      <card-editor v-show="selectedSegment == 'answer'" v-model="answer" :placeholder="$t('answer')" />
    </ion-content>
  </ion-modal>
</template>

<script setup>
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonTitle,
  toastController
} from '@ionic/vue';
import { ref } from 'vue';
import CardEditor from '@/components/Base/CardEditor.vue';

const emit = defineEmits(["added"]);
const props = defineProps(["trigger"]);
const question = ref('');
const answer = ref('');
const selectedSegment = ref('question');
const modal = ref(null);
const cancel = () => {
  modal.value.$el.dismiss(null, 'cancel');
  question.value = '';
  answer.value = '';
  selectedSegment.value = 'question';
};
const addCard = async function () {
  if (question.value === '' || answer.value === '') {
    const toast = await toastController.create({
      message: 'Enter question and answer!',
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }
  else {
    emit('added', {
      question: question.value,
      answer: answer.value,
    });
    question.value = '';
    answer.value = '';
    selectedSegment.value = 'question';
    var list = document.getElementsByClassName("ql-editor");
    for (let item of list) {
      item.innerHTML = '';
    }
    const toast = await toastController.create({
      message: 'Card created!',
      duration: 3000,
      color: 'dark',
    });

    await toast.present();
  }
};
</script>
<style>
ion-content.ion-padding {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
}
</style>