<template>
    <ion-content :scroll-y="false" :fullscreen="true">
        <div v-for="user in duel?.users" :key="user?.id" :style="`height: 50%;background: ` + user?.image?.background">
            <div :class="['user', { ready: duel.actives?.find(el => el.userId == user.id)?.ready }]">
                <user-avatar :userProfile="user" />
            </div>
            <ion-spinner v-if="!duel.actives?.find(el => el.userId == user.id)?.ready"></ion-spinner>
        </div>
    </ion-content>
</template>
<script setup>
import { IonContent, IonSpinner } from '@ionic/vue';
import UserAvatar from "@/components/Base/UserAvatar.vue";
defineProps(["duel", "actives"]);

</script>