<template>
  <div v-if="userProfile" class="userBackground" :style="{ backgroundImage: userProfile.image.background }">
    <div class="userEmoji">{{ userProfile.image.emoji }}</div>
    <ion-badge v-if="badge">
      {{ $t('level') }} {{ userProfile.level }}
    </ion-badge>
  </div>
</template>

<script setup>

const props = defineProps(["userProfile", "badge"]);
</script>

<style lang="scss">
.userBackground {
  height: 200px;
  width: 200px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 50%;
}

.userEmoji {
  font-size: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.small .userEmoji {
  font-size: 25px;
}

ion-badge {
  position: relative;
  left: 160px;
  bottom: 160px;
}
</style>