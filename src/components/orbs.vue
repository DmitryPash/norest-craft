<template>
    <div class="orbs">
        <h2>ORBS</h2>

        <button
            v-for="orb in orbName"
            @click="chooseOrb(getKeyByValue(orbName, orb))"
            :style="`background-image: url('src/assets/icons/sphere/frames/${getKeyByValue(orbName, orb)}.png');`"
            class="orb"
        >
        </button>
    </div>
</template>

<script setup>
import {orbName} from '../const/Const'
import { useOrbStore } from '../store/orbStore';


const orbStore = useOrbStore();

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function chooseOrb(orbName) {
    orbStore.removeSelectOrb()


    orbStore.setSelectOrb(orbName);
}
</script>

<style scoped lang="scss">
    .orb {
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;

        width: 100px;
        height: 100px;

        &:not(:last-child) {
            margin-right: 14px;
        }
    }
</style>