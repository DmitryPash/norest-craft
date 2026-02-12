<template>
    <div class="orbs">
        <h2>ORBS</h2>

        <button
            v-for="orb in orbName"
            @click.stop="chooseOrb(getKeyByValue(orbName, orb))"
            :style="`background-image: url('icons/sphere/frames/${getKeyByValue(orbName, orb)}.png');`"
            class="orb"
        >
        </button>
    </div>
</template>

<script setup>
import {orbName} from '../const/Const'
import { useOrbSelection } from '../composables/useOrbSelection';

const {getKeyByValue, chooseOrb} = useOrbSelection();


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