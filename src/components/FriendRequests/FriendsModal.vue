<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="cancel">{{ $t('cancel') }}</ion-button>
                </ion-buttons>
                <ion-title>{{ $t("friends") }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-list :inset="true">
                <ion-list-header>
                    <ion-label>{{ $t("friends") }}</ion-label>
                </ion-list-header>
                <div v-if="userProfile?.friends?.length > 0">
                    <ion-item-sliding v-for="(user, idx) in userProfile?.friends" :key="user?.id">
                        <ion-item>
                            <div slot="start" v-if="user?.image">
                                <user-avatar class="small avatar" :userProfile="user" />
                            </div>
                            <ion-label>{{ user?.name }}</ion-label>
                        </ion-item>
                        <ion-item-options>
                            <ion-item-option color="danger" @click="removeFriend(user)">{{ $t("delete") }}</ion-item-option>
                        </ion-item-options>
                    </ion-item-sliding>
                </div>
                <div v-else style="margin: 15px;">
                    {{ $t("noFriends") }}
                </div>
            </ion-list>
            <ion-list :inset="true">
                <ion-list-header>
                    <ion-label>
                        {{ $t("addFriends") }}
                    </ion-label>
                </ion-list-header>
                <ion-item>
                    <ion-input :placeholder="$t('enterFriendsUsername')" @ionInput="userName = $event.target.value" />
                    <ion-button @click="addFriend" slot="end" :disabled="userName === ''">{{ $t("add") }}</ion-button>
                </ion-item>
            </ion-list>
            <friends-request-list :currentUserDoc="currentUserDoc" />
        </ion-content>
    </ion-page>
</template>
<script setup>
import {
    IonContent,
    IonPage,
    IonButton,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonList,
    IonListHeader,
    IonLabel,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonInput,
} from "@ionic/vue";
import { ref } from "vue";
import UserAvatar from "@/components/Base/UserAvatar.vue";
import FriendsRequestList from "@/components/FriendRequests/FriendsRequestList.vue";
import { collection, doc, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from "@/plugins/firebase";
import { useCollection } from "vuefire";

const props = defineProps(["userProfile", "modalController"]);
const currentUserDoc = doc(db, "users", props.userProfile.id);

const userName = ref('');
const addFriend = async () => {
    if (userName.value === userProfile.value)
        console.log("Adding own user is not possible."); //TODO: at toast message.
    else {
        const { data: users, promise } = useCollection(
            query(collection(db, "users"), where("name", "==", userName.value))
        );
        await promise.value;
        const friend = users.value[0];
        if (friend) {
            const friendRequest = {
                approved: null,
                from: doc(db, "users", userProfile.value.id),
                to: doc(db, "users", friend.id),
            };
            addDoc(collection(db, "friendRequests"), friendRequest);
            console.log("Sent."); //TODO: at toast message.
        }
    }
};
const removeFriend = async (friend) => {

    userProfile.value.friends = userProfile.value.friends.filter((user) => user.id !== friend.id);
    const userProfileFriends = userProfile.value.friends.map((user) => {
        if (user.id) return doc(db, "users", user.id);
    });

    friend.friends = friend.friends.filter((user) => user.id !== userProfile.value.id);
    const removeUserFriends = friend.friends.map((user) => {
        if (user.id) return doc(db, "users", user.id);
    });

    await updateDoc(doc(db, "users", friend.id), { friends: removeUserFriends });
    await updateDoc(doc(db, "users", userProfile.value.id), { friends: userProfileFriends });

};

const cancel = () => {
    return props.modalController.dismiss(null);
};
</script>