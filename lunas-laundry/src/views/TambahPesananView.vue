<script setup>
import { ref, computed } from "vue";
import { useLaundry } from "../composables/useLaundry";
import { rupiah } from "../utils/format";
import PageHeader from "../components/PageHeader.vue";

const { layanan, tambah } = useLaundry();

const kosong = () => ({
  nama: "",
  hp: "",
  layananId: layanan.value?.[0]?.id ?? 1,
  jumlah: 1,
  estimasi: "",
  dp: 0,
  kondisi: "",
  petugas: "Laundry",
  catatan: "",
});

const form = ref(kosong());
const error = ref("");
const hasil = ref("");

const dipilih = computed(() => layanan.value.find((x) => x.id === Number(form.value.layananId)));

const total = computed(() => Number(dipilih.value?.harga || 0) * Number(form.value.jumlah || 0));

const sisa = computed(() => Math.max(0, total.value - Number(form.value.dp || 0)));

async function salinKode() {
  try {
    await navigator.clipboard.writeText(hasil.value);
    error.value = "";
  } catch {
    error.value = "Kode tidak dapat disalin. Silakan salin manual.";
  }
}

function simpan() {
  error.value = "";
  hasil.value = "";

  const f = form.value;
  const jumlah = Number(f.jumlah);
  const dp = Number(f.dp);

  if (!f.nama.trim() || !f.estimasi || !f.kondisi) {
    error.value = "Lengkapi seluruh data wajib.";
    return;
  }

  if (!dipilih.value) {
    error.value = "Silakan pilih layanan laundry.";
    return;
  }

  if (!Number.isFinite(jumlah) || jumlah <= 0 || (dipilih.value.satuan === "item" && !Number.isInteger(jumlah))) {
    error.value = "Masukkan jumlah atau berat yang valid.";
    return;
  }

  if (!Number.isFinite(dp) || dp < 0 || dp > total.value) {
    error.value = "Pembayaran awal tidak valid.";
    return;
  }

  const p = tambah({
    nama: f.nama.trim(),
    hp: f.hp.trim(),
    layanan: dipilih.value.nama,
    satuan: dipilih.value.satuan,
    jumlah,
    total: total.value,
    dibayar: dp,
    estimasi: f.estimasi,
    kondisi: f.kondisi,
    petugas: "Laundry",
    catatan: f.catatan.trim(),
  });

  hasil.value = p.kode;
  form.value = kosong();
}
</script>

<template>
  <PageHeader title="Tambah Pesanan Baru" subtitle="Catat cucian, kondisi pakaian, dan pembayaran dalam satu formulir." icon="clipboard2-plus" />

  <div v-if="error" class="alert alert-danger mt-4">
    {{ error }}
  </div>

  <div v-if="hasil" class="alert alert-success mt-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
    <span>
      Pesanan berhasil disimpan! Kode pelanggan: <strong>{{ hasil }}</strong>
    </span>

    <button class="btn btn-sm btn-success" @click="salinKode"><i class="bi bi-copy me-1"></i> Salin Kode</button>
  </div>

  <form @submit.prevent="simpan" class="row g-4 mt-1">
    <div class="col-xl-8">
      <!-- INFORMASI PELANGGAN -->
      <div class="content-card form-panel">
        <div class="panel-title">
          <span class="panel-icon">
            <i class="bi bi-person-vcard"></i>
          </span>
          <div>
            <h5>Informasi Pelanggan</h5>
            <small>Isi identitas dan detail penerimaan laundry</small>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Nama Pelanggan *</label>
            <input v-model="form.nama" class="form-control" placeholder="Contoh: Pelanggan Demo" required />
          </div>

          <div class="col-md-6">
            <label class="form-label">Nomor HP (Opsional)</label>
            <input v-model="form.hp" type="tel" class="form-control" placeholder="08xxxxxxxxxx" />
          </div>

          <div class="col-md-6">
            <label class="form-label">Estimasi Selesai *</label>
            <input v-model="form.estimasi" type="date" :min="new Date().toLocaleDateString('en-CA')" class="form-control" required />
          </div>

          <div class="col-md-6">
            <label class="form-label">Nama Petugas</label>
            <input value="Laundry" class="form-control" disabled />
          </div>
        </div>
      </div>

      <!-- PILIH LAYANAN -->
      <div class="content-card form-panel mt-4">
        <div class="panel-title">
          <span class="panel-icon">
            <i class="bi bi-basket2"></i>
          </span>
          <div>
            <h5>Pilih Layanan Laundry</h5>
            <small>Pilih jenis layanan sesuai kebutuhan pelanggan</small>
          </div>
        </div>

        <div class="service-grid">
          <label v-for="l in layanan" :key="l.id" class="service-option" :class="{ selected: Number(form.layananId) === Number(l.id) }">
            <input v-model.number="form.layananId" type="radio" :value="l.id" class="visually-hidden" />

            <span class="service-icon">
              <!-- CUCI LIPAT -->
              <svg v-if="l.nama.toLowerCase().includes('lipat')" viewBox="0 0 100 100" class="service-illustration">
                <circle cx="50" cy="50" r="47" fill="#dff5f1" />
                <path d="M28 32 L39 20 L61 20 L72 32 L83 70 Q50 82 17 70 Z" fill="#8bc9ed" stroke="#176080" stroke-width="3" />
                <path d="M39 20 Q50 35 61 20" fill="none" stroke="#176080" stroke-width="3" />
                <path d="M24 53 Q50 45 76 53 L80 77 Q50 88 20 77 Z" fill="#fff" stroke="#176080" stroke-width="3" />
                <path d="M20 66 Q50 76 80 66 L77 85 Q50 96 23 85 Z" fill="#16a6a9" stroke="#087c88" stroke-width="3" />
                <path d="M30 75 L32 85 M43 77 L44 88 M57 77 L57 88 M69 74 L68 85" stroke="#087c88" stroke-width="2" />
              </svg>

              <!-- CUCI GOSOK -->
              <svg v-else-if="l.nama.toLowerCase().includes('gosok')" viewBox="0 0 100 100" class="service-illustration">
                <circle cx="50" cy="50" r="47" fill="#dff5f1" />
                <path d="M20 67 L37 40 Q43 28 59 29 L70 32 L78 24 Q84 21 87 28 L84 39 L75 45 L66 69 Z" fill="#16a6b0" stroke="#155b78" stroke-width="3" stroke-linejoin="round" />
                <path d="M37 40 Q45 34 59 37 L69 42 L63 61 L26 66 Z" fill="#fff" stroke="#155b78" stroke-width="3" />
                <path d="M48 30 Q48 15 66 16 Q78 16 78 27" fill="none" stroke="#155b78" stroke-width="5" stroke-linecap="round" />
                <path d="M27 67 L76 67" stroke="#155b78" stroke-width="4" stroke-linecap="round" />
                <circle cx="48" cy="48" r="3" fill="#16a6b0" />
              </svg>

              <!-- SEPATU -->
              <svg v-else-if="l.nama.toLowerCase().includes('sepatu')" viewBox="0 0 100 100" class="service-illustration">
                <circle cx="50" cy="50" r="47" fill="#dff5f1" />
                <path d="M15 62 Q28 60 35 44 L43 29 Q49 27 53 40 Q60 51 73 54 L84 61 Q91 67 85 76 Q80 82 65 82 L23 82 Q12 80 15 62 Z" fill="#249acb" stroke="#164e70" stroke-width="3" stroke-linejoin="round" />
                <path d="M35 45 Q49 54 61 57 L79 62" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" />
                <path d="M42 37 L53 44 M38 43 L50 50 M34 49 L47 55" stroke="#fff" stroke-width="3" stroke-linecap="round" />
                <path d="M15 69 Q47 76 87 68 L86 77 Q80 85 63 85 L24 85 Q14 83 15 69 Z" fill="#fff" stroke="#164e70" stroke-width="3" />
                <path d="M24 77 L77 77" stroke="#249acb" stroke-width="2" />
              </svg>

              <!-- SELIMUT -->
              <svg v-else-if="l.nama.toLowerCase().includes('selimut')" viewBox="0 0 100 100" class="service-illustration">
                <circle cx="50" cy="50" r="47" fill="#dff5f1" />
                <path d="M18 48 Q18 39 29 35 L69 22 Q80 20 84 29 L84 45 L37 61 Z" fill="#7fc5e8" stroke="#155b78" stroke-width="3" />
                <path d="M18 48 L68 62 L83 53 L37 39 Z" fill="#acd9ee" stroke="#155b78" stroke-width="3" />
                <path d="M18 48 L18 65 Q18 73 29 77 L68 89 Q80 92 84 82 L84 53 L68 62 Z" fill="#3199c9" stroke="#155b78" stroke-width="3" />
                <path d="M30 59 L68 71 M30 68 L68 80" stroke="#bce8f4" stroke-width="3" stroke-linecap="round" />
              </svg>

              <i v-else class="bi bi-basket2"></i>
            </span>

            <strong>{{ l.nama }}</strong>
            <small>{{ rupiah(l.harga) }} / {{ l.satuan }}</small>
            <i class="bi bi-check-circle-fill service-check"></i>
          </label>
        </div>

        <div class="row g-3 mt-2">
          <div class="col-md-6">
            <label class="form-label"> Berat / Jumlah ({{ dipilih?.satuan }}) * </label>
            <div class="input-group">
              <input v-model.number="form.jumlah" type="number" min="0.1" :step="dipilih?.satuan === 'kg' ? 0.1 : 1" class="form-control" required />
              <span class="input-group-text">{{ dipilih?.satuan }}</span>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Harga Layanan</label>
            <div class="readout">{{ rupiah(dipilih?.harga) }} / {{ dipilih?.satuan }}</div>
          </div>
        </div>
      </div>

      <!-- KONDISI PAKAIAN -->
      <div class="content-card form-panel mt-4">
        <div class="panel-title">
          <span class="panel-icon">
            <i class="bi bi-shield-check"></i>
          </span>
          <div>
            <h5>Konfirmasi Kondisi Pakaian</h5>
            <small>Catat kondisi pakaian pelanggan</small>
          </div>
        </div>

        <label class="form-label"> Apakah ada pakaian berpotensi luntur? * </label>

        <select v-model="form.kondisi" class="form-select" required>
          <option value="" disabled>Pilih kondisi pakaian</option>
          <option value="Ada">Ada</option>
          <option value="Tidak Ada">Tidak Ada</option>
        </select>

        <label class="form-label mt-3">Catatan Tambahan</label>
        <textarea v-model="form.catatan" class="form-control" rows="3" placeholder="Tuliskan catatan pakaian bila diperlukan..."></textarea>
      </div>
    </div>

    <!-- RINGKASAN PEMBAYARAN -->
    <div class="col-xl-4">
      <div class="content-card payment-card">
        <div class="panel-title">
          <span class="panel-icon">
            <i class="bi bi-receipt"></i>
          </span>
          <div>
            <h5>Ringkasan Pesanan</h5>
            <small>Perhitungan otomatis</small>
          </div>
        </div>

        <div class="payment-line">
          <span>Layanan</span>
          <strong>{{ dipilih?.nama }}</strong>
        </div>

        <div class="payment-line">
          <span>Harga Satuan</span>
          <strong>{{ rupiah(dipilih?.harga) }}</strong>
        </div>

        <div class="payment-line">
          <span>Jumlah</span>
          <strong>{{ form.jumlah }} {{ dipilih?.satuan }}</strong>
        </div>

        <div class="total-box">
          <small>TOTAL BIAYA</small>
          <h3>{{ rupiah(total) }}</h3>
        </div>

        <label class="form-label mt-4">Pembayaran Awal / DP</label>
        <div class="input-group">
          <span class="input-group-text">Rp</span>
          <input v-model.number="form.dp" type="number" min="0" :max="total" class="form-control" />
        </div>

        <div class="payment-line mt-4">
          <span>Sisa Tagihan</span>
          <strong class="text-danger">{{ rupiah(sisa) }}</strong>
        </div>

        <div class="payment-note">
          <i class="bi bi-info-circle me-2"></i>
          Pembayaran dapat dilunasi ketika pengambilan.
        </div>

        <button class="btn btn-primary w-100 mt-4 py-3 fw-bold" type="submit">
          <i class="bi bi-check2-circle me-2"></i>
          Simpan Pesanan
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.form-panel,
.payment-card {
  border-radius: 16px;
}

/* JUDUL PANEL */
.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.panel-title h5 {
  margin-bottom: 3px;
  color: #173b57;
  font-size: 16px;
  font-weight: 700;
}

.panel-title small {
  color: #8199a9;
  font-size: 12px;
}

.panel-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: #e4f5f2;
  color: #008e98;
  font-size: 21px;
  flex-shrink: 0;
}

/* KARTU LAYANAN */
.service-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.service-option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  min-height: 165px;
  border: 1.5px solid #dce9ef;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.service-option:hover {
  border-color: #65c5c2;
  background: #f5fcfb;
}

.service-option.selected {
  border-color: #009ca4;
  background: #effaf8;
  box-shadow: 0 3px 10px rgba(0, 142, 152, 0.08);
}

/* ILUSTRASI */
.service-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  border-radius: 50%;
  background: #e4f5f2;
  color: #008e98;
  overflow: hidden;
  flex-shrink: 0;
}

.service-illustration {
  width: 100%;
  height: 100%;
  display: block;
}

.service-option strong {
  color: #183c58;
  font-size: 13px;
  margin-bottom: 3px;
}

.service-option small {
  color: #7893a5;
  font-size: 11px;
}

/* TANDA TERPILIH */
.service-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #078d99;
  font-size: 18px;
  opacity: 0;
}

.service-option.selected .service-check {
  opacity: 1;
}

/* HARGA */
.readout {
  padding: 11px 15px;
  border-radius: 11px;
  background: #f2f7f8;
  color: #173b57;
  font-weight: 700;
  min-height: 44px;
}

/* FORM */
.form-label {
  color: #29475f;
  font-size: 13px;
  font-weight: 600;
}

.form-control,
.form-select {
  border-radius: 10px;
  padding: 10px 12px;
}

/* PEMBAYARAN */
.payment-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px 4px;
  border-bottom: 1px solid #e8eff1;
  color: #476174;
  font-size: 13px;
}

.payment-line strong {
  color: #183c58;
  text-align: right;
}

.total-box {
  padding: 15px;
  margin-top: 14px;
  border-radius: 12px;
  background: #eaf8f6;
}

.total-box small {
  color: #008e98;
  font-weight: 700;
  font-size: 11px;
}

.total-box h3 {
  color: #00858e;
  font-size: 22px;
  font-weight: 800;
  margin: 6px 0 0;
}

.payment-note {
  margin-top: 16px;
  padding: 12px;
  border-radius: 11px;
  background: #edf7ff;
  color: #2586c4;
  font-size: 12px;
}

/* TOMBOL */
.payment-card .btn-primary {
  background: #008e98;
  border-color: #008e98;
  border-radius: 10px;
}

.payment-card .btn-primary:hover {
  background: #007781;
  border-color: #007781;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 400px) {
  .service-option {
    padding: 10px;
    min-height: 150px;
  }

  .service-icon {
    width: 62px;
    height: 62px;
  }
}
</style>
