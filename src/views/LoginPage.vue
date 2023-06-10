<template>
  <ion-page ref="page" id="login" v-if="route.fullPath == '/login'">
    <div id="logo">
      <img src="@/assets/images/logo.png" alt="logo">
    </div>
    <ion-content :scroll-y="false">
      <h1>{{ $t('welcomeBack') }}</h1>
      <form>
        <div class="inputWrapper">
          <input fill="outline" :placeholder="$t('username')" type="email" v-model="email" />
        </div>
        <div class="inputWrapper">
          <input fill="outline" :placeholder="$t('password')" type="password" v-model="password" />
        </div>
        <ion-button type="button" @click="login" color="primary" expand="block">{{ $t('signIn') }}</ion-button>
      </form>
      <fieldset class="hr">
        <legend align="center">{{ $t('or') }}</legend>
      </fieldset>
      <div id="signUp">
        {{ $t('noUser') }} <a @click="openModal">{{ $t('signUp') }}</a>
      </div>
    </ion-content>
  </ion-page>
  <loading-spinner v-if="loading" :message="$t('loggingIn')" />
</template>

<script setup>
import {
  IonContent,
  IonPage,
  IonButton,
  toastController,
  modalController
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useUserStore } from '@/plugins/pinia/users';
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import RegisterUserModal from "@/components/Login/RegisterUser.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const userStore = useUserStore();
const router = useRouter();
const page = ref();
const email = ref('');
const password = ref('');
const loading = ref(false);
const login = async () => {
  if (email.value === '' || password.value === '') {
    const toast = await toastController.create({
      message: 'Enter username and password!',
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }
  else {
    loading.value = true;
    try {
      userStore.logIn(email.value, password.value).then(() => {
        loading.value = false;
        router.push('/home');
      }).catch(async () => {
        const toast = await toastController.create({
          message: 'Wrong credentials!',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
        loading.value = false;
      });
    }
    catch (err) {
      const toast = await toastController.create({
        message: err.message,
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      loading.value = false;
    }
  }
}
const openModal = async () => {
  const modal = await modalController.create({
    component: RegisterUserModal,
    componentProps: {
      modalController: modalController
    },
    presentingElement: page.value.$el,
  });
  modal.present();
}
</script>
<style lang="scss">
#login #logo {
  height: 200px;
  width: 200px;
  position: relative;
  top: 20px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin: 0 auto;
  font-size: 40px;
}

#signUp {
  text-align: center;
  margin-top: 25px;
}

input {
  border: 1px solid #333;
  border-radius: 10px;
  padding: 15px;
  width: 100%;

  &:focus {
    border-color: #0D52FD;
  }
}

form {
  padding: 20px;
  padding-top: 60px;
}

.inputWrapper {
  margin-bottom: 20px;
}

hr,
fieldset.hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px;
  margin-top: 25px;
  color: #ddd;
}

fieldset.hr>legend {
  padding: 0 10px;
}
</style>
