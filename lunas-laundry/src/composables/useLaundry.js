import { ref, computed, watch } from "vue";
import { layananAwal, tahapan } from "../utils/format";

const KEY = "lunas-pesanan";

function baca() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const pesanan = ref(baca());

const usaha = ref(localStorage.getItem("lunas-usaha") || "Murah Laundry");

const layanan = ref(layananAwal);

watch(
  pesanan,
  (data) => {
    localStorage.setItem(KEY, JSON.stringify(data));
  },
  { deep: true },
);

watch(usaha, (nama) => {
  localStorage.setItem("lunas-usaha", nama);
});

const totalPesanan = computed(() => pesanan.value.length);

const diproses = computed(() => pesanan.value.filter((p) => p.status === "Diproses").length);

const siap = computed(() => pesanan.value.filter((p) => p.status === "Siap Diambil").length);

const omzet = computed(() => pesanan.value.reduce((a, p) => a + Number(p.total || 0), 0));

const uangMasuk = computed(() => pesanan.value.reduce((a, p) => a + Number(p.dibayar || 0), 0));

const piutang = computed(() => omzet.value - uangMasuk.value);

function buatKode() {
  let kode;

  do {
    kode = "LNS-" + crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
  } while (pesanan.value.some((p) => p.kode === kode));

  return kode;
}

// TAMBAH PESANAN
function tambah(data) {
  const id = crypto.randomUUID();
  const dibuat = new Date().toISOString();
  const kode = buatKode();

  const petugas = "Laundry";

  const p = {
    ...data,

    id,
    kode,
    dibuat,

    nama: String(data.nama || "").trim(),
    hp: String(data.hp || "").trim(),

    petugas,

    kondisi: data.kondisi || "Tidak Ada",
    catatan: data.catatan || "",

    total: Number(data.total || 0),
    dibayar: Number(data.dibayar || 0),

    status: "Diterima",

    riwayat: [
      {
        status: "Diterima",
        waktu: dibuat,
        petugas,
      },
    ],

    pembayaran:
      Number(data.dibayar) > 0
        ? [
            {
              nominal: Number(data.dibayar),
              waktu: dibuat,
            },
          ]
        : [],
  };

  pesanan.value.unshift(p);

  return p;
}

// UBAH STATUS PESANAN
function ubahStatus(p) {
  const i = tahapan.indexOf(p.status);

  if (i < 0 || i === tahapan.length - 1) {
    return "Pesanan sudah selesai.";
  }

  if (i === 2 && Number(p.dibayar) < Number(p.total)) {
    return "Lunasi tagihan sebelum pesanan diselesaikan.";
  }

  p.status = tahapan[i + 1];

  p.riwayat ||= [];

  p.riwayat.push({
    status: p.status,
    waktu: new Date().toISOString(),
    petugas: "Laundry",
  });

  return "";
}

// PEMBAYARAN
function bayar(p, nominal) {
  nominal = Number(nominal);

  const sisa = Number(p.total) - Number(p.dibayar);

  if (!Number.isFinite(nominal) || nominal <= 0 || nominal > sisa) {
    return "Nominal pembayaran tidak valid.";
  }

  p.dibayar = Number(p.dibayar) + nominal;

  p.pembayaran ||= [];

  p.pembayaran.push({
    nominal,
    waktu: new Date().toISOString(),
  });

  return "";
}

// DATA UNTUK SELURUH HALAMAN
export function useLaundry() {
  return {
    pesanan,
    usaha,
    layanan,

    totalPesanan,
    diproses,
    siap,
    omzet,
    uangMasuk,
    piutang,

    tambah,
    ubahStatus,
    bayar,
  };
}
