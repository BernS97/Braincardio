<template>
    <ion-content :scroll-y="false" :fullscreen="true" v-if="duel?.done">
        <ion-card v-if="winner?.user">
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
    </ion-content>
</template>
<script setup>
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonRow, IonCol } from '@ionic/vue';
import UserAvatar from "@/components/Base/UserAvatar.vue";
import { useDocument } from "vuefire";
import { db } from '@/plugins/firebase';
import { ref } from "vue";
import { doc } from 'firebase/firestore';
const props = defineProps(["duel"]);
const winner = ref(null);
props.duel.users.forEach(userPath => {
    const user = useDocument(doc(db, userPath));
    const corrects = props.duel.turns.filter((turn) => turn.userId == user.id && turn.result == 1).length;
    if (!winner.value || winner.value.corrects < winner?.value?.corrects)
        winner.value = {
            corrects: corrects,
            user: user,
        }
});
</script>
<style>
.userAvatarBackground {
    border-radius: 0;
    width: 100%;
}
</style>