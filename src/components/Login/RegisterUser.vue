<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="cancel()">{{ $t('cancel') }}</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">{{ $t('registerUser') }}</ion-title>
                </ion-toolbar>
            </ion-header>
            <form>
                <div class="inputWrapper">
                    <input fill="outline" :placeholder="$t('username')" type="name" v-model="name" />
                </div>
                <div class="inputWrapper">
                    <input fill="outline" :placeholder="$t('email')" type="email" v-model="email" />
                </div>
                <div class="inputWrapper">
                    <input fill="outline" :placeholder="$t('password')" type="password" v-model="password" />
                </div>
                <ion-button type="button" @click="Register" color="primary" expand="block">{{ $t('register') }}</ion-button>
            </form>
            <fieldset class="hr">
                <legend align="center">{{ $t('or') }}</legend>
            </fieldset>
            <div id="signUp">
                {{ $t('alreadyAnAccount') }} <a @click="modalController.dismiss()">{{ $t('signIn') }}</a>
            </div>
        </ion-content>
    </ion-page>
</template>
  
  
<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IonPage, IonContent, IonToolbar, IonButton, toastController, IonHeader, IonTitle } from '@ionic/vue';
import { useUserStore } from '@/plugins/pinia/users';

const props = defineProps(["modalController"]);
const name = ref('');
const email = ref('');
const password = ref('');
const { t } = useI18n();
const userStore = useUserStore();

const Register = async () => {
    if (email.value === '' || password.value === '' || name.value === '') {
        const toast = await toastController.create({
            message: 'Enter all inputs!',
            duration: 3000,
            color: 'danger'
        });
        await toast.present();
    }
    else {
        try {
            await userStore.register(
                email.value,
                password.value,
                name.value
            );
            props.modalController.dismiss();
            const toast = await toastController.create({
                message: t("userCreated"),
                duration: 3000,
                color: 'dark'
            });
            await toast.present();
        }
        catch (err) {
            const message = t("firebase." + err.code);
            const toast = await toastController.create({
                message: message,
                duration: 3000,
                color: 'danger'
            });
            await toast.present();
        }
    }
}

const cancel = () => {
    props.modalController.dismiss();
}

</script>
<style scoped>
ion-title {
    margin-top: 5px;
}
</style>
