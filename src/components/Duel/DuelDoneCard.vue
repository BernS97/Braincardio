<template>
    <ion-content :scroll-y="false" :fullscreen="true" v-if="duel?.done">
        <ion-card v-if="winner">
            <user-avatar :userProfile="winner" />
            <ion-card-header>
                <ion-card-title>{{ winner?.user?.name }}</ion-card-title>
                <ion-card-subtitle>Won the duel</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
                Here's a small text description for the card content. Nothing more, nothing less.
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
                <ion-card-title>Draw</ion-card-title>
            </ion-card-header>

            <ion-card-content>
                Here's a small text description for the card content. Nothing more, nothing less.
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>
<script setup>
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonRow, IonCol } from '@ionic/vue';
import UserAvatar from "@/components/Base/UserAvatar.vue";
import { ref } from "vue";
const props = defineProps(["duel"]);
const winner = ref(null);
props.duel.users.forEach(user => {
    const corrects = props.duel.turns.filter((turn) => turn.userId == user.id && turn.result == 1).length;
    if (!winner.value || winner.value.corrects < winner?.value?.corrects)
        winner.value = {
            corrects: corrects,
            user: user,
        }
});
</script>