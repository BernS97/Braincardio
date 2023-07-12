<template>
    <ion-content :scroll-y="true" :fullscreen="true">
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ $t('question') }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <div v-html="currentTurn?.card?.question"></div>
            </ion-card-content>
        </ion-card>
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ $t('answer') }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <div v-html="currentTurn?.card?.answer"></div>
            </ion-card-content>
        </ion-card>
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ $t('answerFrom') + oponent?.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <div v-html="currentTurn?.userAnswer"></div>
            </ion-card-content>

        </ion-card>
        <div class="button-wrapper">
            <ion-button color="danger" class="rate-button" @click="setCardResult(0)">
                {{ $t('wrong') }}
            </ion-button>
            <ion-button color="success" class="rate-button" @click="setCardResult(1)">
                {{ $t('right') }}
            </ion-button>
        </div>
    </ion-content>
</template>
<script setup>
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonButton } from '@ionic/vue';
defineProps(["duel", "myTurn", "currentTurn", "oponent"]);
const emit = defineEmits(["duel", "myTurn", "currentTurn"]);

const setCardResult = (result) => {
    emit('setCardResult', result);
}

</script>
<style>
.button-wrapper {
    margin: 15px;
    margin-bottom: 25px;
    height: 50px;
}

.rate-button {
    width: 48%;
    margin-right: 4px;
    float: left;
}
</style>