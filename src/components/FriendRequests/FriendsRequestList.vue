<template>
  <ion-list :inset="true">
    <ion-list-header>
      <ion-label>{{ $t('friendRequests') }}</ion-label>
    </ion-list-header>
    <div v-if="friendRequests.length != 0">
      <ion-item v-for=" request in friendRequests" :key="request.id">
        {{ request?.from?.name }}
        <ion-button color="danger" slot="end" @click=" declineFriendRequest(request)">
          <ion-icon class="decline" :icon="closeOutline" />
        </ion-button>
        <ion-button color="success" slot="end" @click=" acceptFriendRequest(request)">
          <ion-icon class="accept" :icon="checkmarkOutline" />
        </ion-button>
      </ion-item>
    </div>
    <ion-item v-else>
      {{ $t('noFriendRequests') }}
    </ion-item>
  </ion-list>
</template>
<script setup>
import {
  IonButton,
  IonItem,
  IonList,
  IonLabel,
  IonListHeader,
  IonIcon,
  toastController
} from '@ionic/vue';
import { db } from "@/plugins/firebase";
import {
  collection,
  doc,
  query,
  where,
  updateDoc
} from "firebase/firestore";
import { useCollection } from "vuefire";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
import { checkmarkOutline, closeOutline } from "ionicons/icons";

const props = defineProps(["currentUserDoc"]);
const friendRequests = useCollection(query(collection(db, "friendRequests"), where("to", "==", props.currentUserDoc), where("approved", "==", null)));

const acceptFriendRequest = async (request) => {
  //pprove request
  await updateDoc(doc(db, "friendRequests", request.id), { approved: true });
  //add friends
  const from = request.from;
  const name = from.name;
  from.friends = from.friends.map((user) => {
    if (user.id) return doc(db, "users", user.id);
  });
  from.friends.push(doc(db, "users", request.from.id));

  const to = request.to;
  to.friends = to.friends.map((user) => {
    if (user.id) return doc(db, "users", user.id);
  });
  to.friends.push(doc(db, "users", request.from.id));
  await updateDoc(doc(db, "users", request.from.id), { friends: from.friends });
  await updateDoc(doc(db, "users", request.to.id), { friends: to.friends });
  const toast = await toastController.create({
    message: t('acceptedRequest', { name: name }),
    duration: 3000,
    color: 'dark'
  });
  await toast.present();
};
const declineFriendRequest = async (request) => {
  //pprove request
  request.approved = false;
  await updateDoc(doc(db, "friendRequests", request.id), { approved: false });
};

</script>