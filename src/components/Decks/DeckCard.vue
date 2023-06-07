<template>
    <ion-card @click="router.push('/decks/' + deck.id)">
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
                <ion-label>{{ $t('users') }}</ion-label>
                <user-avatars-list :users="deck.users" />
            </ion-item>
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import {
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonBadge,
    IonItem,
    IonLabel,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import UserAvatarsList from '@/components/Base/UserAvatarsList.vue';
defineProps(["deck"]);
const router = useRouter();
</script>