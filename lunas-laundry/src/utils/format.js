export const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export const tanggal = (d) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

export const waktu = (d) => (d ? new Date(d).toLocaleString("id-ID") : "-");

export const tahapan = ["Diterima", "Diproses", "Siap Diambil", "Selesai Diambil"];

export const layananAwal = [
  { id: 1, nama: "Cuci Lipat", harga: 3000, satuan: "kg", ikon: "basket2" },
  { id: 2, nama: "Cuci Gosok", harga: 5000, satuan: "kg", ikon: "stars" },
  { id: 3, nama: "Sepatu", harga: 10000, satuan: "item", ikon: "lightning-charge" },
  { id: 4, nama: "Selimut", harga: 10000, satuan: "item", ikon: "layers" },
];
