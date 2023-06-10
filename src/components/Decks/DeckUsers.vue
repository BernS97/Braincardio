<template>
  <ion-list :inset="true">
    <ion-list-header>
      <ion-label>{{ $t('users') }}</ion-label>
      <ion-button v-if="!readonly" id="userSelection">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-button>
    </ion-list-header>
    <div v-if="deck?.users?.length > 0">
      <ion-item-sliding v-for="(user, idx) in deck?.users" :key="user?.id">
        <ion-item>
          <div slot="start" v-if="user?.image">
            <user-avatar class="small avatar" :userProfile="user" />
          </div>
          <ion-label>{{ user?.name }}</ion-label>
        </ion-item>
        <ion-item-options>
          <ion-item-option color="danger" @click="removeUser(user.id)">{{ $t('delete') }}</ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </div>
    <div style="padding: 25px" v-else>
      {{ $t('addUsers-pre') }} <ion-icon color="primary" :icon="addOutline"></ion-icon> {{ $t('addUsers-suf') }}
    </div>
  </ion-list>
  <user-selection-modal ref="modal" :deck="deck" trigger="userSelection" @added="addUsers" />
</template>
<script setup>
import {
  IonItem, IonItemSliding, IonLabel, IonList, IonListHeader, IonItemOptions, IonItemOption, IonIcon, IonButton
} from '@ionic/vue';
import { addOutline } from "ionicons/icons";
import UserSelectionModal from '@/components/Decks/UserSelectionModal.vue';
import UserAvatar from "@/components/Base/UserAvatar.vue";

const props = defineProps(["deck", "readonly"]);
const emit = defineEmits(["added", "removed"]);
const addUsers = (selectedUsers) => {
  emit('added', selectedUsers);
};
const removeUser = (removedUserId) => {
  emit('removed', removedUserId);
};

</script>