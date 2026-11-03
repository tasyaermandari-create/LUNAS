<script setup>
import { ref, computed } from "vue";
import { useLaundry } from "../composables/useLaundry";
import { rupiah, tanggal, waktu, tahapan } from "../utils/format";

const emit = defineEmits(["login"]);

const { pesanan, usaha } = useLaundry();

const kode = ref("");
const dicari = ref("");
const sudahCari = ref(false);

const hasil = computed(() => pesanan.value.find((p) => p.kode === dicari.value) || null);

function cekStatus() {
  dicari.value = kode.value.trim().toUpperCase();
  sudahCari.value = true;
}

const tahapAktif = computed(() => (hasil.value ? tahapan.indexOf(hasil.value.status) : -1));
</script>

<template>
  <div class="public-page">
    <!-- NAVBAR -->
    <nav class="public-navbar">
      <div class="public-brand">
        <div class="public-logo">
          <i class="bi bi-droplet-half"></i>
        </div>

        <div>
          <strong>LUNAS<span>.</span></strong>
          <small>LAUNDRY MANAGEMENT</small>
        </div>
      </div>

      <button class="admin-login-btn" @click="emit('login')">
        <i class="bi bi-person-lock me-2"></i>
        Login Admin
      </button>
    </nav>

    <!-- HERO -->
    <section class="public-hero">
      <div class="public-hero-content">
        <span class="public-eyebrow">
          <i class="bi bi-stars me-2"></i>
          SELAMAT DATANG DI {{ usaha.toUpperCase() }}
        </span>

        <h1>
          Cucianmu Sudah<br />
          Sampai <span>Mana?</span>
        </h1>

        <p>Pantau progres laundry secara praktis. Tidak perlu datang langsung ke toko hanya untuk menanyakan status cucianmu.</p>

        <div class="public-features">
          <span>
            <i class="bi bi-check-circle-fill"></i>
            Mudah Digunakan
          </span>

          <span>
            <i class="bi bi-check-circle-fill"></i>
            Tanpa Login
          </span>

          <span>
            <i class="bi bi-check-circle-fill"></i>
            Cukup Kode Pesanan
          </span>
        </div>
      </div>

      <div class="public-hero-art">
        <div class="floating-laundry">
          <i class="bi bi-basket2-fill"></i>
          <div>
            <strong>Laundry Tracking</strong>
            <small>Pesanan Tercatat, Cucian Terpantau.</small>
          </div>
          <i class="bi bi-check-circle-fill check-art"></i>
        </div>

        <div class="big-laundry-icon">
          <i class="bi bi-droplet-half"></i>
        </div>
      </div>
    </section>

    <!-- TRACKING -->
    <section class="public-tracking" id="tracking">
      <div class="tracking-heading">
        <span class="section-tag">TRACK YOUR ORDER</span>
        <h2>Lacak Pesanan Laundry</h2>
        <p>Masukkan kode unik yang tertera pada nota untuk mengetahui perkembangan cucian.</p>
      </div>

      <div class="public-tracking-card">
        <form @submit.prevent="cekStatus">
          <label class="form-label fw-bold"> Kode Pesanan </label>

          <div class="public-search">
            <div class="public-search-input">
              <i class="bi bi-upc-scan"></i>

              <input v-model="kode" placeholder="Contoh: LNS-A3F29B10" required />
            </div>

            <button type="submit">
              <i class="bi bi-search me-2"></i>
              Cek Status
            </button>
          </div>
        </form>

        <div v-if="sudahCari && !hasil" class="public-not-found">
          <i class="bi bi-exclamation-circle"></i>

          <div>
            <strong>Kode pesanan tidak ditemukan.</strong>
            <p>Periksa kembali kode pada nota laundry atau tanyakan kepada petugas.</p>
          </div>
        </div>

        <!-- HASIL TRACKING -->
        <div v-if="hasil" class="public-result">
          <div class="result-top">
            <div>
              <small>KODE PESANAN</small>
              <h4>{{ hasil.kode }}</h4>
            </div>

            <span class="public-status">
              {{ hasil.status }}
            </span>
          </div>

          <div class="result-details">
            <div>
              <small>Layanan</small>
              <strong>{{ hasil.layanan }}</strong>
            </div>

            <div>
              <small>Estimasi Selesai</small>
              <strong>{{ tanggal(hasil.estimasi) }}</strong>
            </div>

            <div>
              <small>Total Tagihan</small>
              <strong>{{ rupiah(hasil.total) }}</strong>
            </div>

            <div>
              <small>Sisa Pembayaran</small>
              <strong>
                {{ rupiah(hasil.total - hasil.dibayar) }}
              </strong>
            </div>
          </div>

          <h5 class="fw-bold mt-4 mb-3">Progres Cucian</h5>

          <div class="public-progress">
            <div v-for="(t, i) in tahapan" :key="t" class="progress-step" :class="{ completed: i <= tahapAktif }">
              <div class="step-circle">
                <i v-if="i <= tahapAktif" class="bi bi-check-lg"></i>
                <span v-else>{{ i + 1 }}</span>
              </div>

              <span>{{ t }}</span>
            </div>
          </div>

          <div v-if="hasil.riwayat?.length" class="mt-4">
            <h6 class="fw-bold">Riwayat Status</h6>

            <div v-for="(r, i) in hasil.riwayat" :key="i" class="public-history">
              <i class="bi bi-check-circle-fill"></i>

              <div>
                <strong>{{ r.status }}</strong>
                <small>{{ waktu(r.waktu) }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="tracking-help">
          <i class="bi bi-info-circle me-2"></i>
          Kode pesanan diberikan oleh petugas saat melakukan transaksi laundry.
        </div>
      </div>
    </section>

    <!-- INFORMASI -->
    <section class="public-benefits">
      <div class="benefit-card">
        <i class="bi bi-phone"></i>
        <h5>Akses Lebih Mudah</h5>
        <p>Pantau perkembangan cucian melalui website.</p>
      </div>

      <div class="benefit-card">
        <i class="bi bi-clock-history"></i>
        <h5>Informasi Progres</h5>
        <p>Ketahui tahapan pengerjaan pesanan laundry.</p>
      </div>

      <div class="benefit-card">
        <i class="bi bi-receipt"></i>
        <h5>Transparansi Pesanan</h5>
        <p>Lihat informasi layanan dan tagihan pesanan.</p>
      </div>
    </section>

    <footer class="public-footer">
      <strong>LUNAS.</strong>
      <p>Pesanan Tercatat, Cucian Terpantau.</p>
      <small>© 2026 Laundry Order & Administration System</small>
    </footer>
  </div>
</template>
