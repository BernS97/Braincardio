<template>
    <ion-loading />
</template>
<script setup>
import { IonLoading, loadingController } from '@ionic/vue';
import { onMounted, onUnmounted } from 'vue';
const props = defineProps(["text"]);
const showLoading = async () => {
    const loading = await loadingController.create({
        message: props.text,
    });

    loading.present();
}

onMounted(() => {
    showLoading();
});

onUnmounted(() => {
    loadingController.dismiss();
});

</script>
<style>
.ion-page ion-loading {
    top: 85px;
}

.loading-wrapper {
    top: -45px;
    position: relative;
}
</style>