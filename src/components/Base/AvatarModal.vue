<template>
    <ion-page ref="avatarmodal">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="cancel()">{{ $t('cancel') }}</ion-button>
                </ion-buttons>
                <ion-title>{{ $t('avatar') }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :scroll-y="false">
            <user-avatar style="margin-top: 20px;" :userProfile="userProfile" />
            <ion-card id="emoji-card">
                <ion-card-header>
                    <ion-card-title>{{ $t('emoji') }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-grid>
                        <ion-col class="emoji" v-for="emoji in emojis" :key="emoji" @click="setEmoji(emoji)">
                            {{ emoji }}
                        </ion-col>
                    </ion-grid>
                </ion-card-content>
            </ion-card>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ $t('background') }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <div class="color-list">
                        <div v-for="selectableBackground in backgrounds" :key="selectableBackground"
                            @click="setBackground(selectableBackground)" class="color"
                            :style="`background: ` + selectableBackground">
                        </div>
                    </div>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/plugins/pinia/users';
import { IonPage, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonHeader, IonModal, IonToolbar, IonTitle, IonCol, IonGrid, IonContent } from '@ionic/vue';
import UserAvatar from "@/components/Base/UserAvatar.vue";
import { emojis, backgrounds } from "@/utils/AvatarUtil";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/plugins/firebase";

const props = defineProps(["modalController"]);

const userStore = useUserStore();
const avatarmodal = ref(null);

const userProfile = userStore.getLoggedInUserProfile;
const emoji = ref(userProfile.image.emoji ?? emojis[0]);
const background = ref(userProfile.image.background ?? backgrounds[0]);

const setEmoji = (selectedemoji) => {
    emoji.value = selectedemoji;
    userProfile.image.emoji = selectedemoji;
    userStore.setImage({
        emoji: emoji.value,
        background: background.value
    });
}

const setBackground = (selectedbackground) => {
    background.value = selectedbackground;
    userProfile.image.background = selectedbackground;
    userStore.setImage({
        emoji: emoji.value,
        background: background.value
    });
}

const cancel = () => {
    const image = {
        emoji: emoji.value,
        background: background.value,
    };
    updateDoc(doc(db, "users", userProfile.id), { image: image });
    props.modalController.dismiss(image);
};
</script>
<style lang="scss">
.color-list {
    height: 50px;
}

.color {
    height: 25px;
    width: 25px;
    float: left;
    margin-right: 15px;
    margin-bottom: 10px;
}

.emoji {
    font-size: 24px;
}

#emoji-card {
    max-height: 300px;
    display: flex;
    flex-direction: column;
    overflow: scroll;
}
</style>