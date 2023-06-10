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
<script>
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
} from "firebase/firestore";
import { useCollection } from "vuefire";

import { checkmarkOutline, closeOutline } from "ionicons/icons";

const props = defineProps(["currentUserDoc"]);
const friendRequests = useCollection(query(collection(db, "friendrequests"), where("to", "==", props.currentUserDoc), where("approved", "==", null)));

const acceptFriendRequest = async (request) => {
  //pprove request
  request.approved = true;
  await updateDoc(doc(db, "friendrequests", request.id), request);
  //add friends
  const from = request.from;
  from.friends.push(doc(db, "users", request.to.id));
  const to = request.to;
  to.friends.push(doc(db, "users", request.from.id));
  await updateDoc(doc(db, "users", request.from.id), from);
  await updateDoc(doc(db, "users", request.to.id), to);
  this.user.friends = to.friends;
  const toast = await toastController.create({
    message: t('acceptedRequest', { name: request.from.name }),
    duration: 3000,
    color: 'dark'
  });
  await toast.present();
};
const declineFriendRequest = async (request) => {
  //pprove request
  request.approved = false;
  await updateDoc(doc(db, "friendrequests", request.id), request);
};

</script>