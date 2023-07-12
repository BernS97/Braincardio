<template>
  <ion-card @click="presentActionSheet(deck)">
    <ion-card-header>
      <ion-card-title>
        {{ deck.name }}
        <ion-badge v-if="deck.subject">
          {{ deck.subject }}
        </ion-badge>
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item>
        <ion-label>{{ $t("users") }}</ion-label>
        <user-avatars-list v-if="deck?.users[deck?.users.length - 1]?.image" :users="deck?.users" />
      </ion-item>
    </ion-card-content>
  </ion-card>
</template>
<script setup>
import {
  actionSheetController,
  modalController,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonBadge,
  IonItem,
  IonLabel,
  toastController
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import UserAvatarsList from "@/components/Base/UserAvatarsList.vue";
import CreateDuelModal from '@/components/Duel/CreateDuelModal.vue';
import {
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/plugins/firebase";
defineProps(["deck"]);
const { t } = useI18n();
const router = useRouter();

const presentActionSheet = async (deck) => {
  const actionSheet = await actionSheetController.create({
    header: 'Actions',
    buttons: [
      {
        text: t('delete'),
        role: 'destructive',
        handler: () => {
          deleteDeck(deck);
        }
      },
      {
        text: t('details'),
        handler: () => {
          router.push('/decks/' + deck.id);
        }
      },
      {
        text: t('edit'),
        handler: () => {
          router.push('/decks/edit/' + deck.id);
        }
      },
      {
        text: t('learn'),
        handler: () => {
          router.push('/learn/' + deck.id);
        }
      },
      {
        text: t('duel'),
        handler: () => {
          openDuelModal(deck);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      },
    ],
  });

  await actionSheet.present();
}

const deleteDeck = async (deck) => {
  const deckId = deck.id;
  router.push("/decks");
  deck.cards.forEach(async (card) => {
    const cardId = card.id;
    await deleteDoc(doc(db, "cards", cardId));
  });
  await deleteDoc(doc(db, "decks", deckId));
  const toast = await toastController.create({
    message: t("deckDeleted"),
    duration: 3000,
    color: "danger",
  });
  await toast.present();
};

const openDuelModal = async (deck) => {
  const modal = await modalController.create({
    component: CreateDuelModal,
    componentProps: {
      modalController: modalController,
      deck: deck
    },
    initialBreakpoint: 1.0
  });
  modal.present();
}
</script>
