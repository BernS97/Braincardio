<template>
    <ion-content :scroll-y="false" :fullscreen="true">
        <ion-card v-if="myTurn && currentTurn?.card">
            <ion-card-header>
                <ion-card-title>{{ $t('question') }}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
                {{ currentTurn?.card?.question }}
            </ion-card-content>
        </ion-card>
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ $t('yourAnswer') }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-textarea :label="$t('answer')" label-placement="stacked" @ionInput="answer = $event.target.value"
                    type="text" :auto-grow="true" />
                <ion-button @click="answerCard">
                    {{ $t('answer') }}
                </ion-button>
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>
<script setup>
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonButton, IonTextarea } from '@ionic/vue';
import { ref } from 'vue';
defineProps(["duel", "myTurn", "currentTurn"]);
const emit = defineEmits(["duel", "myTurn", "currentTurn"]);
const answer = ref("");

const answerCard = () => {
    emit('answerCard', answer.value);
}

</script>