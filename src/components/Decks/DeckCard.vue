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
        <user-avatars-list :users="deck.users" />
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
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import UserAvatarsList from "@/components/Base/UserAvatarsList.vue";
import CreateDuelModal from '@/components/Duel/CreateDuelModal.vue';
defineProps(["deck"]);
const { t } = useI18n();
const router = useRouter();
useI18n

const presentActionSheet = async (deck) => {
  const actionSheet = await actionSheetController.create({
    header: 'Actions',
    buttons: [
      {
        text: t('delete'),
        role: 'destructive',
        handler: () => {
          deleteDeck();
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
