<template>
    <ion-page v-if="route.fullPath != '/login' && route.fullPath != '/'">
        <ion-fab v-if="route.fullPath === '/decks'">
            <ion-fab-button @click="router.push('/decks/create')">
                <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>
        <ion-tabs class="translucent">
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar class="translucent" slot="bottom">
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
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonBadge, IonFab, IonFabButton, } from '@ionic/vue';
import { archive, logoBuffer, personCircle } from 'ionicons/icons';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { db } from '@/plugins/firebase';
import { useCollection } from 'vuefire'
import {
    collection,
    doc,
    query,
    where,
} from "firebase/firestore";
import { useUserStore } from '@/plugins/pinia/users';
import { add } from 'ionicons/icons';


const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const currentUserDoc = doc(db, "users", userStore.getLoggedInUserProfile.id);
const duels = useCollection(query(collection(db, "duels"), where("done", "==", false), where("users", "array-contains", currentUserDoc)));
const friendRequests = useCollection(query(collection(db, "friendRequests"), where("to", "==", currentUserDoc), where("approved", "==", null)));

</script>
<style>
.translucent {
    backdrop-filter: blur(30px);
    --background: rgba(255, 255, 255, 0.05);
}

ion-tab-bar {
    position: relative;
    width: 90%;
    transform: translate(-50%, -50%);
    left: 50%;
    border-radius: 30px;
    padding-bottom: 0;
    border: 1px solid rgba(2, 52, 54, 0.08);
    height: 80px;
    overflow: hidden;
    box-shadow: 0px -5px 10px rgba(3, 181, 170, 0.08);
}

ion-header {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    --ion-safe-area-top: 40px;
    --ion-safe-area-bottom: 40px;
}

.tabs-inner {
    margin-bottom: 50px;
}


#circle {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background: red;
}

ion-fab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: absolute;
    bottom: 115px;
}
</style>
  