<template>
    <h2>ORBS</h2>

    <button v-for="orb in orbName" @click="chooseOrb(getKeyByValue(orbName, orb))">
        {{ getKeyByValue(orbName, orb) }}
    </button>
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