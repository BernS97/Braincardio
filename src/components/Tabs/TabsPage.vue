<template>
    <ion-page v-if="route.fullPath != '/login' && route.fullPath != '/'">
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar class="translucent" :translucent="true" slot="bottom">
                <ion-tab-button tab="home" href="/home">
                    <ion-badge color="primary" v-if="duels?.length != 0">{{ duels.length }}</ion-badge>
                    <ion-icon :icon="archive" />
                    <ion-label>{{ t('home') }}</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="decks" href="/decks">
                    <ion-icon :icon="logoBuffer" />
                    <ion-label>{{ t('decks') }}</ion-label>
                </ion-tab-button>
                <ion-tab-button tab="profile" href="/profile">
                    <ion-badge color="primary" v-if="friendRequests?.length != 0">{{ friendRequests.length }}</ion-badge>
                    <ion-icon :icon="personCircle" />
                    <ion-label>{{ t('profile') }}</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>
  
<script setup>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonBadge } from '@ionic/vue';
import { archive, logoBuffer, personCircle } from 'ionicons/icons';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router';
import { db } from '@/plugins/firebase';
import { useCollection } from 'vuefire'
import {
    collection,
    doc,
    query,
    where,
} from "firebase/firestore";
import { useUserStore } from '@/plugins/pinia/users';


const { t } = useI18n();
const route = useRoute();
const userStore = useUserStore();
const currentUserDoc = doc(db, "users", userStore.getLoggedInUserProfile.id);
const duels = useCollection(query(collection(db, "duels"), where("done", "==", false), where("users", "array-contains", currentUserDoc)));
const friendRequests = useCollection(query(collection(db, "friendRequests"), where("to", "==", currentUserDoc), where("approved", "==", null)));

</script>
  