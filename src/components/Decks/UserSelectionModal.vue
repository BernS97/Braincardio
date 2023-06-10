<template>
  <ion-modal ref="modal" :trigger="trigger">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel()">{{ $t('cancel') }}</ion-button>
        </ion-buttons>
        <ion-title>{{ $t('addUsers') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="addUsers">{{ $t('add') }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list :inset="true">
        <ion-item :class="{ selected: checkSelected(user.id) }" v-for="user in users" :key="user.id"
          @click="addUser(user)">
          <div slot="start">
            <user-avatar class="small avatar" :userProfile="user" />
          </div>
          {{ user.name }}
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
  IonList
} from '@ionic/vue';
import { ref, onBeforeMount } from 'vue';
import { db } from '@/plugins/firebase';
import { useUserStore } from '@/plugins/pinia/users';
import UserAvatar from '@/components/Base/UserAvatar.vue';
import { useCollection } from 'vuefire';
import {
  collection,
  doc
} from "firebase/firestore";

const props = defineProps(["deck", "trigger"]);
const emit = defineEmits(["added"]);
const userStore = useUserStore();
const currentUserId = userStore.getLoggedInUserProfile.id;
const users = ref();
const modal = ref(null);
const selectedUsers = ref(props.deck.users);


const cancel = () => {
  modal.value.$el.dismiss(null, 'cancel');
};

const addUser = (user) => {
  if (!checkSelected(user.id))
    selectedUsers.value.push(user);
  else {
    const index = selectedUsers.value.map(function (x) { return x.id; }).indexOf(user.id);
    selectedUsers.value.splice(index, 1);
  }
};

const addUsers = () => {
  emit('added', selectedUsers);
  cancel();
};

const checkSelected = (id) => {
  return selectedUsers.value.find(el => el.id === id);
}

onBeforeMount(async () => {
  const { data: userList, promise } = useCollection(collection(db, "users"));
  await promise.value;
  users.value = userList.value.filter(user => user.id !== currentUserId)
})

</script>
<style>
.selected {
  --background: var(--highlight-color-focused);
}
</style>