<template>
  <ion-page ref="page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/decks" />
        </ion-buttons>
        <ion-title v-if="deck">{{
          deck.name !== "" ? deck.name : $t("createDeck")
        }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="save">
            {{ $t("save") }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" v-if="deck">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title v-if="deck" size="large">{{
            deck.name !== "" ? deck.name : $t("createDeck")
          }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list :inset="true">
        <ion-item>
          <ion-input
            :label="$t('title')"
            label-placement="stacked"
            :maxlength="50"
            :placeholder="$t('titlePlaceholder')"
            @ionInput="deck.name = $event.target.value"
            :value="deck.name"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            :label="$t('subject')"
            label-placement="stacked"
            :maxlength="20"
            :value="deck.subject"
            :placeholder="$t('subjectPlaceholder')"
            @ionInput="deck.subject = $event.target.value"
          />
        </ion-item>
        <ion-item>
          <ion-input
            :label="$t('lecturer')"
            label-placement="stacked"
            :maxlength="50"
            :value="deck.lecturer"
            :placeholder="$t('lecturerPlaceholder')"
            @ionInput="deck.lecturer = $event.target.value"
          />
        </ion-item>
      </ion-list>
      <deck-users
        v-if="!loading"
        :deck="deck"
        @added="addUsers"
        @removed="removeUser"
      />
      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>{{ $t("cards") }}</ion-label>
          <ion-button id="open-modal">
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>
        </ion-list-header>
        <div v-if="deck?.cards?.length > 0">
          <ion-item-sliding v-for="(card, idx) in deck?.cards" :key="card">
            <ion-item>
              <ion-label>
                <div v-html="card?.question"></div>
              </ion-label>
            </ion-item>

            <ion-item-options>
              <ion-item-option color="danger" @click="removeCard(idx)">{{
                $t("delete")
              }}</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </div>
        <div style="padding: 25px" v-else>
          {{ $t("addCards-pre") }}
          <ion-icon color="primary" :icon="addOutline"></ion-icon>
          {{ $t("addCards-suf") }}
        </div>
      </ion-list>
      <CreateCardModal ref="modal" trigger="open-modal" @added="addCard" />
      <ion-button
        v-if="id"
        class="deleteButton"
        expand="block"
        @click="deleteDeck"
        color="danger"
      >
        <div>Delete</div>
      </ion-button>
      <loading-spinner v-if="loading" :message="$t('loggingIn')" />
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonItemOption,
  IonLabel,
  IonList,
  IonListHeader,
  IonButtons,
  IonButton,
  IonItemOptions,
  IonItemSliding,
  IonBackButton,
  IonIcon,
  IonInput,
  toastController,
} from "@ionic/vue";
import { addOutline } from "ionicons/icons";
import { ref, onBeforeMount, watch } from "vue";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "vue-router";
import { db } from "@/plugins/firebase";
import { useUserStore } from "@/plugins/pinia/users";
import CreateCardModal from "@/components/Decks/CreateCardModal.vue";
import DeckUsers from "@/components/Decks/DeckUsers.vue";
import { useDocument } from "vuefire";
import { useI18n } from "vue-i18n";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const props = defineProps(["id"]);
const userStore = useUserStore();
const router = useRouter();
const page = ref();
const loading = ref(false);
const { t } = useI18n();

const deck = props.id
  ? useDocument(doc(db, "decks", props.id))
  : ref({
      name: "",
      lecturer: "",
      cards: [],
      users: [],
    });
let cards = [];

watch(deck, () => {
  if (cards.length == 0) cards = deck?.value?.cards;
});

const addCard = async (card) => {
  await saveAndAddCard(card);
};

const removeCard = (index) => {
  deck.value.cards.splice(index, 1);
  cards.splice(index, 1);
};
const addUsers = (users) => {
  deck.value.users = users.value;
};
const removeUser = (userId) => {
  const index = deck.value.users
    .map(function (x) {
      return x.id;
    })
    .indexOf(userId);
  deck.value.users.splice(index, 1);
};
const validate = () => {
  return (
    deck.value.name !== "" &&
    deck.value.lecturer !== "" &&
    deck.value.cards.length !== 0
  );
};
const saveAndAddCard = async (card) => {
  const cardDoc = await addDoc(collection(db, "cards"), card);
  card.id = cardDoc.id;
  deck.value.cards.push(card);
  cards.push(card);
};

onBeforeMount(() => {
  const currentUser = userStore.getLoggedInUserProfile;
  if (!props.id) deck.value.users.push(currentUser);
});
const save = async () => {
  loading.value = true;
  if (validate()) {
    deck.value.cards = cards;
    deck.value.users = deck.value.users.map((user) => {
      if (user.id) return doc(db, "users", user.id);
    });
    deck.value.cards = deck.value.cards.map((card) => {
      if (card.id) return doc(db, "cards", card.id);
    });
    if (props.id) updateDoc(doc(db, "decks", props.id), deck.value);
    else addDoc(collection(db, "decks"), deck.value);
    router.push("/decks");
    deck.value = {
      title: "",
      lecturer: "",
      cards: [],
    };
    loading.value = false;
  } else {
    loading.value = false;
    const toast = await toastController.create({
      message: "Enter all values!",
      duration: 3000,
      color: "danger",
    });
    await toast.present();
  }
};

const deleteDeck = async () => {
  router.push("/decks");
  deck.value.cards.forEach(async (card) => {
    await deleteDoc(doc(db, "cards", card.id));
  });
  await deleteDoc(doc(db, "decks", props.id));
  const toast = await toastController.create({
    message: t("deckDeleted"),
    duration: 3000,
    color: "danger",
  });
  await toast.present();
};
</script>

<style>
.header-collapse-condense-inactive:not(.header-collapse-condense)
  ion-toolbar.toolbar-searchbar {
  display: none;
}

.deleteButton {
  margin: 15px;
}
</style>
