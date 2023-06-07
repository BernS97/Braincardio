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
    </ion-header>
    <ion-content class="ion-padding">
      <card-editor v-model="question" :placeholder="$t('question')" />
      <card-editor v-model="answer" :placeholder="$t('answer')" />
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
  IonTitle,
  toastController
} from '@ionic/vue';
import { ref } from 'vue';
import CardEditor from '@/components/Decks/CardEditor.vue';

const emit = defineEmits(["added"]);
const props = defineProps(["trigger"]);
const question = ref('');
const answer = ref('');
const modal = ref(null);
const cancel = () => {
  modal.value.$el.dismiss(null, 'cancel');
  question.value = '';
  answer.value = '';
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