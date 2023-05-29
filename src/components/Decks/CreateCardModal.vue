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
      <ion-list :inset="true">
        <ion-item>
          <ion-textarea :label="$t('question')" label-placement="stacked" ref="input" type="text" :auto-grow="true"
            :placeholder="$t('question')" @ionInput="question = $event.target.value;" :value="question"></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-textarea :label="$t('answer')" label-placement="stacked" ref="input" type="text" :auto-grow="true"
            :placeholder="$t('answer')" @ionInput=" answer = $event.target.value;" :value="answer"></ion-textarea>
        </ion-item>
      </ion-list>

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
  IonItem,
  IonTextarea,
  IonList,
  toastController
} from '@ionic/vue';
import { ref } from 'vue';

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
    const toast = await toastController.create({
      message: 'Card created!',
      duration: 3000,
      color: 'dark'
    });

    await toast.present();
  }
};
</script>