<template>
    <ion-page v-if="route.fullPath != '/login'">
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar class="translucent" :translucent="true" slot="bottom">
                <ion-tab-button tab="home" href="/home">
                    <ion-icon :icon="archive" />
                    <ion-label>{{ t('home') }}</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="decks" href="/decks">
                    <ion-icon :icon="logoBuffer" />
                    <ion-label>{{ t('decks') }}</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="profile" href="/profile">
                    <ion-icon :icon="personCircle" />
                    <ion-label>{{ t('profile') }}</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>
  
<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { archive, logoBuffer, personCircle } from 'ionicons/icons';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router';
const { t } = useI18n()
const route = useRoute()
</script>
  