<template>
    <ion-content :scroll-y="false" :fullscreen="true" v-if="duel?.done">
        <ion-card v-if="winner?.user" class="winner" @click="addConfetti">
            <user-avatar :userProfile="winner?.user" />
            <ion-card-header>
                <ion-card-title>{{ winner?.user?.name }}</ion-card-title>
                <ion-card-subtitle>{{ $t('duelWon') }}</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
                {{ $t('winnerText') }}
            </ion-card-content>
        </ion-card>
        <ion-card v-else>
            <ion-row>
                <ion-col>
                    <user-avatar :userProfile="duel?.users[0]" />
                </ion-col>
                <ion-col>
                    <user-avatar :userProfile="duel?.users[1]" />
                </ion-col>
            </ion-row>
            <ion-card-header>
                <ion-card-title>{{ $t('draw') }}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
                {{ $t('drawText') }}
            </ion-card-content>
        </ion-card>
        <ion-list :inset="true">
            <ion-list-header>
                <ion-label>{{ $t('turns') }}</ion-label>
            </ion-list-header>
            <ion-item v-for="turn in duel.turns">
                <div slot="start" v-if="turn?.user?.image">
                    <user-avatar class="small avatar" :userProfile="turn?.user" />
                </div>
                <ion-label v-html="turn?.card.question"></ion-label>
                <ion-icon class="decline" :icon="closeOutline" color="danger" slot="end" v-if="turn.result === 0" />
                <ion-icon class="accept" :icon="checkmarkOutline" color="success" slot="end" v-if="turn.result === 1" />
            </ion-item>
        </ion-list>
    </ion-content>
</template>
<script setup>
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonRow, IonCol, IonList, IonListHeader, IonItem, IonIcon, IonLabel } from '@ionic/vue';
import UserAvatar from "@/components/Base/UserAvatar.vue";
import { onMounted, ref } from "vue";
import { checkmarkOutline, closeOutline } from "ionicons/icons";
import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti();

const props = defineProps(["duel"]);
const winner = ref(null);
props.duel.users.forEach(user => {
    const corrects = props.duel.turns.filter((turn) => turn.userId == user.id && turn.result == 1).length;
    props.duel.turns.map((turn) => {
        turn.user = props.duel.users.filter((user) => user.id === turn.userId)[0];
    });
    if (!winner.value || winner.value.corrects < winner?.value?.corrects)
        winner.value = {
            corrects: corrects,
            user: user,
        }
});

onMounted(() => {
    addConfetti();
    addConfetti();
    addConfetti();
})

const addConfetti = () => {
    jsConfetti.addConfetti(
        {
            emojis: [winner.value.user.image.emoji]
        });
}
</script>
<style>
.winner .userAvatarBackground {
    border-radius: 0;
    width: 100%;
}
</style>