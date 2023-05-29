<template>
    <div class="userBackground" :style="{ backgroundImage: userProfile.image.background }">
        <p class="userEmoji">{{ userProfile.image.emoji }}</p>
    </div>
</template>

<script>
const props = defineProps("userProfile");
</script>

<style>
.userBackground {
  height: 200px; 
  width: 200px; 
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 50%;
}

.userEmoji {
  text-align: center;
  margin: auto;
  font-size: 75px;
  padding: 25%;
}
</style>