<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>
                {{ title }}
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <Bar v-if="data" id="my-chart-id" :data="data" :options="options" />
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/vue';
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

import { getStatsPerDay } from '@/composables/LearnStatistics';
import { onMounted, watch } from 'vue';

const options = {
    scales: {
        y: {
            min: 0,
            max: 100,
            ticks: {
                // forces step size to be 50 units
                stepSize: 50
            }
        },
        x: {
            grid: {
                display: false,
            },
        }
    }
};
const data = ref();
const props = defineProps(["title", "stats"]);
const printChart = (stats) => {
    if (stats) {
        const dates = [];
        const labels = [];
        const today = new Date();
        // eslint-disable-next-line for-direction
        for (let i = 6; i > -1; i--) {
            // Generate the date for each label by subtracting the number of days from the current date
            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            dates.push(date.toDateString());
            labels.push(date.toDateString().split(' ')[0]);
        }
        const datasets = [{
            label: 'Prozent',
            borderWidth: 2,
            data: [],
            backgroundColor: [],
            borderRadius: Number.MAX_VALUE,
            borderSkipped: false,
        }];

        dates.forEach((label) => {
            const percentage = getStatsPerDay(label);
            datasets[0].data.push(percentage);
            if (percentage <= 33)
                datasets[0].backgroundColor.push('rgba(255, 99, 132, 1)');
            else if (percentage <= 66)
                datasets[0].backgroundColor.push('rgba(255, 205, 86, 1)');
            else
                datasets[0].backgroundColor.push('rgba(75, 192, 192, 1)');

        });
        data.value = {
            labels: labels,
            datasets: datasets
        };
    }
}

watch(props.stats, () => {
    printChart(props.stats);
})
onMounted(() => {
    printChart(props.stats);
})

</script>
<style scoped>
ion-card {
    --background: var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)));
    width: 100%;
    height: 250px;
}
</style>
