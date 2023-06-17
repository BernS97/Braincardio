<template>
    <ion-content :scroll-y="false" :fullscreen="true">
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ $t('question') }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                {{ currentTurn?.card?.question }}
            </ion-card-content>
        </ion-card>
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ $t('answer') }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                {{ currentTurn?.card?.answer }}
            </ion-card-content>
        </ion-card>
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ $t('answerFrom') + oponent?.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                {{ currentTurn?.userAnswer }}
            </ion-card-content>
            <div>
                <ion-button color="danger" @click="setCardResult(0)">
                    {{ $t('wrong') }}
                </ion-button>
                <ion-button color="success" @click="setCardResult(1)">
                    {{ $t('right') }}
                </ion-button>
            </div>
        </ion-card>

    </ion-content>
</template>
<script setup>
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonCardHeader } from '@ionic/vue';
defineProps(["duel", "myTurn", "currentTurn", "oponent"]);
const emit = defineEmits(["duel", "myTurn", "currentTurn"]);

const setCardResult = (result) => {
    emit('setCardResult', result);
}

</script>