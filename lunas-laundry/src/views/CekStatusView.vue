<script setup>
import { ref, computed } from "vue";
import { useLaundry } from "../composables/useLaundry";
import { rupiah, tanggal, waktu } from "../utils/format";
import PageHeader from "../components/PageHeader.vue";

const { pesanan } = useLaundry();

const kode = ref("");
const dicari = ref("");

const hasil = computed(() => pesanan.value.find((p) => p.kode === dicari.value) || null);

function cek() {
  dicari.value = kode.value.trim().toUpperCase();
}
</script>

<template>
  <PageHeader title="Lacak Pesanan Laundry" subtitle="Masukkan kode unik pada nota untuk mengetahui progres cucian." icon="search" />

  <div class="tracking-container">
    <div class="content-card text-center">
      <div class="tracking-icon">
        <i class="bi bi-search"></i>
      </div>

      <h4 class="fw-bold">Cek Status Pesanan</h4>
      <p class="text-muted small">Contoh format: LNS-XXXXXXXXXX</p>

      <form @submit.prevent="cek" class="d-flex gap-2 mt-4">
        <input v-model="kode" class="form-control form-control-lg" placeholder="Masukkan kode pesanan" required />

        <button class="btn btn-primary px-4" type="submit">Cari</button>
      </form>

      <div v-if="dicari && !hasil" class="alert alert-warning mt-4 text-start">
        Kode <b>{{ dicari }}</b> tidak ditemukan. Buat pesanan terlebih dahulu melalui menu Tambah Pesanan.
      </div>

      <div v-if="hasil" class="tracking-result mt-4 text-start">
        <div class="d-flex justify-content-between align-items-center">
          <strong>{{ hasil.kode }}</strong>
          <span class="status-pill">{{ hasil.status }}</span>
        </div>

        <hr />

        <div class="payment-line">
          <span>Layanan</span>
          <strong>{{ hasil.layanan }}</strong>
        </div>

        <div class="payment-line">
          <span>Estimasi</span>
          <strong>{{ tanggal(hasil.estimasi) }}</strong>
        </div>

        <div class="payment-line">
          <span>Total</span>
          <strong>{{ rupiah(hasil.total) }}</strong>
        </div>

        <div class="payment-line">
          <span>Sisa Tagihan</span>
          <strong>{{ rupiah(hasil.total - hasil.dibayar) }}</strong>
        </div>

        <h6 class="fw-bold mt-4">Riwayat Pengerjaan</h6>

        <div v-for="(r, i) in hasil.riwayat || []" :key="i" class="history-item">
          <i class="bi bi-check-circle-fill text-success"></i>
          <div>
            <strong>{{ r.status }}</strong>
            <small class="d-block text-muted">{{ waktu(r.waktu) }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
