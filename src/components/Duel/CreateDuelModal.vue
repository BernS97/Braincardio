<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="cancel()">{{ $t('cancel') }}</ion-button>
      </ion-buttons>
      <ion-title>{{ $t('ceateDuel') }}</ion-title>
      <ion-buttons slot="end">
        <ion-button :strong="true" @click="save">{{ $t('create') }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list :inset="true">
      <ion-item>
        <ion-input :label="$t('name')" label-placement="stacked" :maxlength="20" :placeholder="$t('namePlaceholder')"
          @ionInput="duel.name = $event.target.value;" :value="duel.name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">{{ $t('cardAmount') }}</ion-label>
        <ion-range :min="2" :max="deck.cards.length" @ionChange=" duel.cardAmount = $event.detail.value;" :ticks="true"
          :snaps="true" step="2" :pin="true">
          <div slot="label">2</div>
          <div slot="end">{{ deck.cards.length }}</div>
        </ion-range>
      </ion-item>
    </ion-list>
    <ion-list :inset="true">
      <ion-list-header>
        <ion-label>{{ $t('users') }}</ion-label>
      </ion-list-header>
      <ion-item :class="{ selected: checkSelected(user.id) }" v-for="user in users" :key="user.id"
        @click=" addUser(user)">
        <div slot="start">
          <user-avatar class="avatar small" :userProfile="user" />
        </div>
        {{ user.name }}
      </ion-item>
    </ion-list>
  </ion-content>
</template>
<script setup>
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonList,
  IonListHeader,
  IonInput,
  IonLabel,
  IonRange,
  toastController
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/plugins/firebase';
import { addDoc, collection, doc } from 'firebase/firestore';
import UserAvatar from "@/components/Base/UserAvatar.vue";
import { useUserStore } from '@/plugins/pinia/users';

const props = defineProps(["modalController", "deck"]);
const router = useRouter();
const userStore = useUserStore();
const loggedInId = userStore.getLoggedInUserProfile?.id;
const users = props.deck?.users.filter(el => el.id != loggedInId);
const selectedUser = ref(users[0]);
const modal = ref(null);
const duel = ref({
  name: null,
  cardAmount: 2,
  starter: Math.floor(Math.random() * 2),
  users: props.deck?.users.filter(el => el.id == loggedInId),
  done: false,
  actives: [{
    userId: props.deck?.users.filter(el => el.id == loggedInId)[0].id,
    ready: false,
  }],
  turns: [],
  deck: doc(db, 'decks', props.deck.id)
});


const cancel = () => {
  props.modalController.dismiss(null, 'cancel');
};

const addUser = (user) => {
  selectedUser.value = user;
};

const checkSelected = (id) => {
  return selectedUser.value.id === id;
}

const validate = () => {
  return duel.value.name !== '' && duel.value.cardAmount !== 0 && selectedUser.value != null;
};

const save = async () => {
  if (validate()) {
    duel.value.users.push(selectedUser.value);
    duel.value.actives.push({
      userId: selectedUser.value.id,
      ready: false,
    });
    duel.value.users = await duel.value.users.map((user) => {
      if (user.id)
        return doc(db, "users", user.id);
    })
    const duelId = await (await addDoc(collection(db, "duels"), duel.value)).id;
    cancel();
    router.push('/duel/' + duelId);
  } else {
    const toast = await toastController.create({
      message: 'Enter all values!',
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }
}
</script>
<style>
.selected {
  --background: var(--highlight-color-focused);
}
</style>