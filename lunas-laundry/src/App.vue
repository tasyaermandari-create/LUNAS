<script setup>
import { ref, computed } from "vue";

import PublicHome from "./views/PublicHome.vue";
import LoginView from "./views/LoginView.vue";

import AppSidebar from "./components/AppSidebar.vue";
import DashboardView from "./views/DashboardView.vue";
import TambahPesananView from "./views/TambahPesananView.vue";
import DataPesananView from "./views/DataPesananView.vue";
import CekStatusView from "./views/CekStatusView.vue";
import LaporanView from "./views/LaporanView.vue";
import PengaturanView from "./views/PengaturanView.vue";

import { useLaundry } from "./composables/useLaundry";

const { usaha } = useLaundry();

// Tampilan pertama adalah halaman pelanggan.
const mode = ref("public");
const menu = ref("Dashboard");

const halaman = {
  Dashboard: DashboardView,
  "Tambah Pesanan": TambahPesananView,
  "Data Pesanan": DataPesananView,
  "Cek Status": CekStatusView,
  Laporan: LaporanView,
  Pengaturan: PengaturanView,
};

const view = computed(() => halaman[menu.value] || DashboardView);

const hari = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function masukAdmin() {
  mode.value = "admin";
  menu.value = "Dashboard";
}

function logout() {
  mode.value = "public";
  menu.value = "Dashboard";
}
</script>

<template>
  <!-- HALAMAN PELANGGAN -->
  <PublicHome v-if="mode === 'public'" @login="mode = 'login'" />

  <!-- LOGIN ADMIN -->
  <LoginView v-else-if="mode === 'login'" @login="masukAdmin" @back="mode = 'public'" />

  <!-- DASHBOARD ADMIN -->
  <div v-else class="app-layout">
    <AppSidebar :active="menu" :usaha="usaha" @navigate="menu = $event" />

    <main class="main-content">
      <header class="topbar">
        <div>
          <small class="text-muted">{{ hari }}</small>
          <h4 class="mb-0 fw-bold">{{ menu }}</h4>
        </div>

        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-danger btn-sm" @click="logout">
            <i class="bi bi-box-arrow-right me-1"></i>
            Keluar
          </button>

          <div class="avatar">
            <i class="bi bi-person-fill"></i>
          </div>
        </div>
      </header>

      <component :is="view" @navigate="menu = $event" />

      <footer class="footer">© 2026 LUNAS — Laundry Order & Administration System</footer>
    </main>
  </div>
</template>
