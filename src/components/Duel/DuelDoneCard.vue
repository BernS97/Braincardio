<template>
    <ion-content :scroll-y="true" :fullscreen="true" v-if="duel?.done">
        <ion-card v-if="winner?.user" class="winner" @click="addConfetti(emojis)">
            <user-avatar :userProfile="winner?.user" />
            <ion-card-header>
                <ion-card-title>{{ winner?.user?.name }}</ion-card-title>
                <ion-card-subtitle>{{ $t('duelWon') }}</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
                {{ $t('winnerText') }}
            </ion-card-content>
        </ion-card>
        <ion-card v-else @click="addConfetti(emojis)">
            <ion-row>
                <ion-col>
                    <div :style="{ backgroundImage: duel?.users[0].image.background }">
                        <div class="userAvatarEmoji">{{ duel?.users[0].image.emoji }}</div>
                    </div>
                </ion-col>
                <ion-col>
                    <div :style="{ backgroundImage: duel?.users[1].image.background }">
                        <div class="userAvatarEmoji">{{ duel?.users[1].image.emoji }}</div>
                    </div>
                </ion-col>
            </ion-row>
            <ion-card-header>
                <ion-card-title>{{ $t('draw') }}</ion-card-title>
            </ion-card-header>
        </ion-card>
        <ion-list :inset="true">
            <ion-list-header>
                <ion-label>{{ $t('turns') }}</ion-label>
            </ion-list-header>
            <ion-item v-for="turn in duel.turns">
                <div slot="start">
                    <user-avatar class="small avatar"
                        :userProfile="duel.users.filter((user) => user.id === turn.userId)[0]" />
                </div>
                <ion-label v-html="turn?.card?.question"></ion-label>
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
let emojis = [];
props.duel.users.forEach(user => {
    const corrects = props.duel.turns.filter((turn) => turn.userId == user.id && turn.result == 1).length;
    if (!winner.value || winner.value.corrects < corrects) {
        winner.value = {
            corrects: corrects,
            user: user,
        }
    }
    else if (winner.value.corrects == corrects)
        winner.value = null;
    emojis.push(user.image.emoji);
});

onMounted(() => {
    if (!Array.isArray(winner.value) && winner.value)
        emojis = [winner?.value?.user?.image?.emoji];
    addConfetti(emojis);
})

const addConfetti = (emojis) => {
    jsConfetti.addConfetti(
        {
            emojis: [emojis.join('')]
        });
}
</script>
<style lang="scss">
.winner .userAvatarBackground {
    border-radius: 0;
    width: 100%;
}

ion-col {
    padding: 0;

    &>div {
        height: 200px;
    }
}
</style>