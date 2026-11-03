<script setup>
import { ref, computed } from "vue";
import { useLaundry } from "../composables/useLaundry";
import { rupiah, tanggal } from "../utils/format";
import PageHeader from "../components/PageHeader.vue";

const emit = defineEmits(["navigate"]);

const { pesanan, ubahStatus, bayar, usaha } = useLaundry();

const cari = ref("");
const pesan = ref("");
const jenisPesan = ref("info");

const filtered = computed(() => pesanan.value.filter((p) => (p.nama + " " + p.kode).toLowerCase().includes(cari.value.toLowerCase())));

// FORMAT SISA TAGIHAN
function sisaTagihan(p) {
  return Math.max(0, Number(p.total || 0) - Number(p.dibayar || 0));
}

// STATUS PESANAN
function lanjut(p) {
  const hasil = ubahStatus(p);

  if (hasil) {
    tampilPesan(hasil, "warning");
  } else {
    tampilPesan("Status pesanan berhasil diperbarui.", "success");
  }
}

// PEMBAYARAN
function lunasi(p) {
  const sisa = sisaTagihan(p);

  if (sisa <= 0) {
    tampilPesan("Pesanan ini sudah lunas.", "info");
    return;
  }

  const input = prompt(`Pelanggan: ${p.nama}\nSisa tagihan: ${rupiah(sisa)}\n\nMasukkan nominal pembayaran:`);

  if (input === null) return;

  const nominal = Number(input.replace(/[^\d]/g, ""));

  if (!input.trim() || !Number.isFinite(nominal) || nominal <= 0) {
    tampilPesan("Masukkan nominal pembayaran yang benar.", "danger");
    return;
  }

  const hasil = bayar(p, nominal);

  if (hasil) {
    tampilPesan(hasil, "danger");
    return;
  }

  tampilPesan(`Pembayaran ${rupiah(nominal)} berhasil! Sisa tagihan: ${rupiah(sisaTagihan(p))}`, "success");
}

// NOTA PESANAN
function nota(p) {
  const isi = `
${usaha.value.toUpperCase()}
================================
             NOTA LAUNDRY
================================

Kode Pesanan : ${p.kode}
Tanggal      : ${tanggal(p.dibuat)}
Pelanggan    : ${p.nama}
Nomor HP     : ${p.hp || "-"}

--------------------------------
DETAIL LAYANAN
--------------------------------

Layanan      : ${p.layanan}
Jumlah       : ${p.jumlah} ${p.satuan}
Estimasi     : ${tanggal(p.estimasi)}

Kondisi Pakaian:
${p.kondisi || "-"}

Catatan:
${p.catatan || "-"}

--------------------------------
RINCIAN PEMBAYARAN
--------------------------------

Total Biaya  : ${rupiah(p.total)}
Sudah Dibayar: ${rupiah(p.dibayar)}
Sisa Tagihan : ${rupiah(sisaTagihan(p))}

--------------------------------
Status       : ${p.status}
Petugas      : ${p.petugas || "Laundry"}

================================
Pesanan Tercatat, Cucian Terpantau.
          TERIMA KASIH
================================
`;

  const blob = new Blob([isi], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "Nota-" + p.kode + ".txt";
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// PESAN NOTIFIKASI
function tampilPesan(teks, tipe = "info") {
  pesan.value = teks;
  jenisPesan.value = tipe;
}
</script>

<template>
  <PageHeader title="Manajemen Pesanan" subtitle="Pantau progres cucian, pembayaran, dan nota pelanggan." icon="basket2">
    <button class="btn btn-light fw-bold mt-2" @click="emit('navigate', 'Tambah Pesanan')">
      <i class="bi bi-plus-circle me-1"></i>
      Tambah Pesanan
    </button>
  </PageHeader>

  <!-- NOTIFIKASI -->
  <div v-if="pesan" class="alert mt-4" :class="'alert-' + jenisPesan">
    {{ pesan }}

    <button class="btn-close float-end" @click="pesan = ''"></button>
  </div>

  <!-- DAFTAR PESANAN -->
  <div class="content-card mt-4">
    <div class="section-heading mb-3">
      <h5>Daftar Pesanan ({{ filtered.length }})</h5>

      <input v-model="cari" class="form-control search-field" placeholder="Cari kode atau pelanggan..." />
    </div>

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Layanan</th>
            <th>Total</th>
            <th>Sisa</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <!-- KODE -->
            <td class="fw-bold">
              {{ p.kode }}
            </td>

            <!-- PELANGGAN -->
            <td>
              <strong>{{ p.nama }}</strong>

              <small class="d-block text-muted">
                {{ p.hp || "Nomor HP tidak tersedia" }}
              </small>
            </td>

            <!-- LAYANAN -->
            <td>
              {{ p.layanan }}
              <small class="d-block text-muted"> {{ p.jumlah }} {{ p.satuan }} </small>
            </td>

            <!-- TOTAL -->
            <td>
              {{ rupiah(p.total) }}
            </td>

            <!-- SISA TAGIHAN -->
            <td>
              <strong :class="sisaTagihan(p) > 0 ? 'text-danger' : 'text-success'">
                {{ rupiah(sisaTagihan(p)) }}
              </strong>

              <small class="d-block" :class="sisaTagihan(p) > 0 ? 'text-danger' : 'text-success'">
                {{ sisaTagihan(p) > 0 ? "Belum Lunas" : "Lunas" }}
              </small>
            </td>

            <!-- STATUS -->
            <td>
              <span class="status-pill">
                {{ p.status }}
              </span>
            </td>

            <!-- AKSI -->
            <td>
              <div class="d-flex gap-1">
                <button class="btn btn-sm btn-outline-primary" title="Status Berikutnya" @click="lanjut(p)" :disabled="p.status === 'Selesai'">
                  <i class="bi bi-arrow-right-circle"></i>
                </button>

                <button class="btn btn-sm btn-outline-success" title="Catat Pembayaran" @click="lunasi(p)" :disabled="sisaTagihan(p) <= 0">
                  <i class="bi bi-cash"></i>
                </button>

                <button class="btn btn-sm btn-outline-secondary" title="Unduh Nota" @click="nota(p)">
                  <i class="bi bi-receipt"></i>
                </button>
              </div>
            </td>
          </tr>

          <!-- KOSONG -->
          <tr v-if="!filtered.length">
            <td colspan="7" class="text-center text-muted py-4">
              <i class="bi bi-inbox fs-3 d-block mb-2"></i>
              Belum ada pesanan yang cocok.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
