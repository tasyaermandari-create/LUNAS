<script setup>
import { useLaundry } from "../composables/useLaundry";
import { rupiah } from "../utils/format";
import PageHeader from "../components/PageHeader.vue";
import StatCard from "../components/StatCard.vue";

const { pesanan, omzet, uangMasuk, piutang } = useLaundry();
</script>

<template>
  <PageHeader title="Laporan Transaksi" subtitle="Ringkasan tagihan, pembayaran diterima, dan piutang laundry." icon="bar-chart" />

  <div class="row g-3 mt-1">
    <div class="col-md-4">
      <StatCard label="Total Tagihan" :value="rupiah(omzet)" icon="receipt" tone="blue" />
    </div>
    <div class="col-md-4">
      <StatCard label="Pembayaran Diterima" :value="rupiah(uangMasuk)" icon="cash-stack" tone="green" />
    </div>
    <div class="col-md-4">
      <StatCard label="Belum Dibayar" :value="rupiah(piutang)" icon="wallet2" tone="orange" />
    </div>
  </div>

  <div class="content-card mt-4">
    <h5>Rekap Transaksi</h5>

    <div class="table-responsive mt-3">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Total</th>
            <th>Dibayar</th>
            <th>Sisa</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in pesanan" :key="p.id">
            <td>{{ p.kode }}</td>
            <td>{{ p.nama }}</td>
            <td>{{ rupiah(p.total) }}</td>
            <td>{{ rupiah(p.dibayar) }}</td>
            <td>{{ rupiah(p.total - p.dibayar) }}</td>
          </tr>

          <tr v-if="!pesanan.length">
            <td colspan="5" class="text-center text-muted py-4">Belum ada transaksi.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
