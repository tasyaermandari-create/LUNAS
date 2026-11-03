<script setup>
defineProps({
  active: String,
  usaha: String,
});

const emit = defineEmits(["navigate"]);

const menu = [
  ["Dashboard", "grid-1x2-fill"],
  ["Tambah Pesanan", "plus-circle"],
  ["Data Pesanan", "basket2"],
  ["Cek Status", "search"],
  ["Laporan", "bar-chart"],
  ["Pengaturan", "gear"],
];
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">
        <i class="bi bi-droplet-half"></i>
      </div>

      <div>
        <h3>LUNAS<span>.</span></h3>
        <small>Laundry Order & Administration System</small>
      </div>
    </div>

    <div class="sidebar-label">MENU UTAMA</div>

    <nav>
      <button v-for="[nama, ikon] in menu" :key="nama" class="nav-item" :class="{ active: active === nama }" @click="emit('navigate', nama)">
        <i :class="'bi bi-' + ikon"></i>
        {{ nama }}
      </button>
    </nav>

    <div class="sidebar-bottom">
      <i class="bi bi-shop me-2"></i>
      {{ usaha }}

      <small class="d-block mt-2"> Pesanan Tercatat, Cucian Terpantau. </small>
    </div>
  </aside>
</template>
