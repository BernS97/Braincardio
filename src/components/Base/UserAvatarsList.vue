<template>
    <div class="wrapper">
        <div class="avatar" v-for="(user, index) in slicedUsers" key="user.id" :style="{ backgroundImage: `url(${user.img})`, left: `-${index * 15}px` }">
        </div>
        <div class="avatar additionalUsers" v-if="users.length > 3">
            +{{ users.length - slicedUsers.length }}
        </div>
    </div>>
</template> 

<script setup>
const props = defineProps(["users"]); 
const slicedUsers = props.users.slice(0,3);

</script>

<style>
.wrapper {
    position: relative;
    display: flex;
    margin-top: 5px;
}

.avatar {
    border: 2px solid white;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-size: contain;
    position: relative;
}

.additionalUsers{
    padding: 5%;
    background: black;
    left: -45px;
}
</style>