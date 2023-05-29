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
            Users
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import { useRouter } from 'vue-router';
defineProps(["deck"]);
const router = useRouter();
</script>