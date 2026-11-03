<script setup>
import { useLaundry } from "../composables/useLaundry";
import { rupiah } from "../utils/format";
import PageHeader from "../components/PageHeader.vue";

const { usaha, layanan } = useLaundry();
</script>

<template>
  <PageHeader title="Pengaturan Usaha" subtitle="Kelola identitas laundry dan lihat daftar harga layanan." icon="gear" />

  <div class="content-card mt-4">
    <h5>Identitas Usaha</h5>

    <label class="form-label mt-3">Nama Laundry</label>
    <input v-model="usaha" class="form-control mb-3" />

    <label class="form-label">Nama Sistem</label>
    <input class="form-control mb-3" value="LUNAS - Laundry Order & Administration System" readonly />

    <div class="alert alert-info">Versi ini masih prototype lokal. Login dan pemisahan data antarlaundry memerlukan backend.</div>

    <h5 class="mt-4">Daftar Layanan</h5>

    <div v-for="l in layanan" :key="l.id" class="d-flex justify-content-between border-bottom py-3">
      <span>{{ l.nama }}</span>
      <b>{{ rupiah(l.harga) }} / {{ l.satuan }}</b>
    </div>
  </div>
</template>
