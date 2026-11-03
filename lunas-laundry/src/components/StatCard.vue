<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  tone: {
    type: String,
    default: "teal",
  },
});
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon" :class="tone">
      <i :class="'bi bi-' + icon"></i>
    </div>

    <p>{{ label }}</p>
    <h3>{{ value }}</h3>
  </div>
</template>
