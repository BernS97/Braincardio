<template>
  <div v-if="userProfile.image" class="userAvatarBackground" :style="{ backgroundImage: userProfile.image.background }">
    <div class="userAvatarEmoji">{{ userProfile.image.emoji }}</div>
    <ion-badge class="levelBadge" v-if="badge">
      {{ $t('level') }} {{ level }}
    </ion-badge>
  </div>
</template>

<script setup>
import {
  IonBadge
} from '@ionic/vue';
const props = defineProps(["userProfile", "badge"]);

const level = (props.userProfile.experience / 1000) + 1;
</script>

<style lang="scss">
.userAvatarBackground {
  width: 150px;
  height: 150px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 50%;
}

.userAvatarEmoji {
  font-size: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.small .userAvatarEmoji {
  font-size: 25px;
}

ion-badge.levelBadge {
  position: relative;
  left: 115px;
  bottom: 130px;
}
</style>