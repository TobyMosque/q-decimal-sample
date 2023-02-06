<template>
  <q-page class="row items-center justify-evenly">
    <my-numeric-input v-model="valueA" label="Value A"></my-numeric-input>
    <my-numeric-input v-model="valueB" label="Value B"></my-numeric-input>
  </q-page>
</template>

<script setup lang="ts">
import MyNumericInput from 'src/components/MyNumericInput.vue';
import { ref } from 'vue';

const valueA = ref(1234567.89);
const valueB = ref(0);
</script>
