<template>
    <div class="container">
        <div class="canvas canvas6">
            <div class="spinner p1"></div>
            <div class="spinner p2"></div>
            <div class="spinner p3"></div>
            <div class="spinner p4"></div>
        </div>
        <div>{{ message }}</div>
    </div>
    <div class="backdrop"></div>
</template>
<script setup>
defineProps(["message"]);
</script>
<style lang="scss">
.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 0 auto;
    max-width: 650px;
    min-width: 200px;
    position: absolute;
    top: 20%;
    width: 100%;
    z-index: 1;
    color: white;
}

.canvas {
    align-items: center;
    background: #0c2840;
    border-radius: 50%;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    height: 10em;
    justify-content: center;
    margin: 1em 1em 2em 1em;
    width: 10em;
}

/* Spinner starts here */
.spinner {
    background: #4DB6AC;
    border-radius: 10px;
    margin: .2em;
    rotate: 10deg;
}

.p1 {
    animation: fall 1s linear .3s infinite;
    height: 4em;
    width: 1em;
    background: #2CC0F8;
}

.p2 {
    animation: fall 1s linear .2s infinite;
    height: 5em;
    width: 1em;
    background: #22D8F8;
}

.p3 {
    animation: fall 1s linear .1s infinite;
    height: 6em;
    width: 1em;
    background: #18EDF7;
}

.p4 {
    animation: fall 1s linear infinite;
    height: 3em;
    width: 1em;
    background: #03FEF8;
}

@keyframes fall {
    0% {
        transform: translateY(-15px);
    }

    25%,
    75% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-15px);
    }
}

/* Spinner 6 ends here */

@media (max-width: 600px) {
    .container {
        align-items: center;
        flex-direction: column;
    }

    .canvas {
        margin: 1em;
    }
}

.backdrop {
    background: #333;
    height: 100%;
    width: 100%;
    position: absolute;
    opacity: 0.65;
}
</style>