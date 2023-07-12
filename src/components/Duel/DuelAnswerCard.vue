<template>
    <ion-content :scroll-y="true" :fullscreen="true">
        <ion-card v-if="myTurn && currentTurn?.card">
            <ion-card-header>
                <ion-card-title>{{ $t('question') }}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
                <div v-html="currentTurn?.card.question"></div>
            </ion-card-content>
        </ion-card>
        <card-editor v-model="answer" :placeholder="$t('answer')" :title="$t('yourAnswer')" />
        <ion-button id="answerCard" expand="block" @click="answerCard">
            {{ $t('answer') }}
        </ion-button>
    </ion-content>
</template>
<script setup>
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonButton, IonTextarea } from '@ionic/vue';
import { ref } from 'vue';
import CardEditor from '@/components/Base/CardEditor.vue';
defineProps(["duel", "myTurn", "currentTurn"]);
const emit = defineEmits(["duel", "myTurn", "currentTurn", "answerCard"]);
const answer = ref("");

const answerCard = () => {
    emit('answerCard', answer.value);
}

</script>
<style>
ion-card.card-editor {
    height: 60%;
}

#answerCard {
    margin: 15px;
}
</style>