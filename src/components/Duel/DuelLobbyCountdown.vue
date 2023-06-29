<template>
    <div class="countdown">
        {{ count }}
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
const count = ref(5);

const countDownTimer = () => {
    interval = setInterval(() => {
        if (count.value > 0)
            count.value--;
        else if (count.value === 0) {
            countdown.value = true;
        }
    }, 1000)
}

onMounted(() => {
    countDownTimer();
})
</script>
<style>
.countdown {
    position: absolute;
    font-size: 75px;
    color: #fff;
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333;
    opacity: 0.65;
}
</style>