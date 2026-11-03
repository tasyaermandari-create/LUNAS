<script setup>
import { useLaundry } from "../composables/useLaundry";
import { rupiah } from "../utils/format";
import PageHeader from "../components/PageHeader.vue";
import StatCard from "../components/StatCard.vue";

const emit = defineEmits(["navigate"]);

const { pesanan, totalPesanan, diproses, siap, omzet } = useLaundry();
</script>

<template>
  <PageHeader title="Selamat Datang di LUNAS!" subtitle="Pantau operasional laundry dengan lebih mudah dan terorganisir." icon="basket2-fill">
    <button class="btn btn-light fw-bold mt-2" @click="emit('navigate', 'Tambah Pesanan')">
      <i class="bi bi-plus-lg me-2"></i>
      Buat Pesanan Baru
    </button>
  </PageHeader>

  <div class="row g-3 mt-1">
    <div class="col-sm-6 col-xl-3">
      <StatCard label="Total Pesanan" :value="totalPesanan" icon="basket2" tone="blue" />
    </div>
    <div class="col-sm-6 col-xl-3">
      <StatCard label="Sedang Diproses" :value="diproses" icon="arrow-repeat" tone="orange" />
    </div>
    <div class="col-sm-6 col-xl-3">
      <StatCard label="Siap Diambil" :value="siap" icon="check-circle" tone="green" />
    </div>
    <div class="col-sm-6 col-xl-3">
      <StatCard label="Total Tagihan" :value="rupiah(omzet)" icon="wallet2" tone="purple" />
    </div>
  </div>

  <div class="content-card mt-4">
    <div class="section-heading">
      <h5>Pesanan Terbaru</h5>
      <button class="btn btn-sm btn-outline-primary" @click="emit('navigate', 'Data Pesanan')">Lihat Semua</button>
    </div>

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Layanan</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pesanan.slice(0, 5)" :key="p.id">
            <td class="fw-bold">{{ p.kode }}</td>
            <td>{{ p.nama }}</td>
            <td>{{ p.layanan }}</td>
            <td>{{ rupiah(p.total) }}</td>
            <td>
              <span class="status-pill">{{ p.status }}</span>
            </td>
          </tr>
          <tr v-if="!pesanan.length">
            <td colspan="5" class="text-center text-muted py-4">Belum ada pesanan. Tambahkan pesanan pertama!</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
