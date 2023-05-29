<template>
    <div class="wrapper">
        <user-avatar class="avatar small" v-for="(user, index) in slicedUsers" :userProfile="user"
            :style="{ left: `-${index * 15}px` }" />
        <div class="avatar additionalUsers" v-if="users.length > 3">
            +{{ users.length - slicedUsers.length }}
        </div>
    </div>
</template> 

<script setup>
import UserAvatar from '@/components/Base/UserAvatar.vue';
const props = defineProps(["users"]);
const slicedUsers = props.users.slice(0, 3);

</script>

<style>
.wrapper {
    position: relative;
    display: flex;
    right: -20px;
    align-items: center;
    justify-content: center;
}

.avatar {
    border: 2px solid white;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-size: contain;
    position: relative;
}

.additionalUsers {
    padding: 5%;
    background: black;
    left: -45px;
    color: white;
}
</style>