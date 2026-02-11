<template>
    <div class="orbs">
        <h2>ORBS</h2>

        <button
            v-for="orb in orbName"
            @click.stop="chooseOrb(getKeyByValue(orbName, orb))"
            :style="`background-image: url('src/assets/icons/sphere/frames/${getKeyByValue(orbName, orb)}.png');`"
            class="orb"
        >
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import {orbName} from '../const/Const'
import { useOrbStore } from '../store/orbStore';


const orbStore = useOrbStore();

const selectedOrb = computed(() => orbStore.selectedOrb)

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function chooseOrb(orbName) {
    orbStore.removeSelectOrb()

    Object.assign(document.body.style, {
        cursor: `url('src/assets/icons/sphere/64/${orbName}.png') 16 16, auto`,
    })

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

        &--clicked {
            cursor: url('../assets/icons/sphere/64/exalting.png') 16 16, auto !important;
        }


        &:not(:last-child) {
            margin-right: 14px;
        }
    }
</style>