<script setup>
import { ref } from "vue";

const emit = defineEmits(["login", "back"]);

const username = ref("");
const password = ref("");
const error = ref("");
const lihatPassword = ref(false);

function masuk() {
  error.value = "";

  // Hanya untuk simulasi prototype lokal.
  if (username.value === "admin" && password.value === "admin123") {
    emit("login");
  } else {
    error.value = "Username atau password demo tidak sesuai.";
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <button class="login-back" @click="emit('back')">
        <i class="bi bi-arrow-left me-2"></i>
        Kembali ke Halaman Pelanggan
      </button>

      <div class="login-symbol">
        <i class="bi bi-droplet-half"></i>
      </div>

      <h2>Selamat Datang!</h2>
      <p>Masuk ke dashboard pengelolaan laundry.</p>

      <div v-if="error" class="alert alert-danger small">
        {{ error }}
      </div>

      <form @submit.prevent="masuk">
        <label class="form-label">Username</label>

        <div class="login-input">
          <i class="bi bi-person"></i>
          <input v-model="username" placeholder="Masukkan username" autocomplete="username" required />
        </div>

        <label class="form-label mt-3">Password</label>

        <div class="login-input">
          <i class="bi bi-lock"></i>

          <input v-model="password" :type="lihatPassword ? 'text' : 'password'" placeholder="Masukkan password" autocomplete="current-password" required />

          <button type="button" class="password-toggle" @click="lihatPassword = !lihatPassword">
            <i :class="lihatPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>

        <button class="login-submit" type="submit">
          Masuk Dashboard
          <i class="bi bi-arrow-right ms-2"></i>
        </button>
      </form>

      <div class="demo-credential">
        <strong>Akun Demo Presentasi</strong>
        <span>Username: admin</span>
        <span>Password: admin123</span>
      </div>
    </div>

    <div class="login-side">
      <div class="login-side-content">
        <i class="bi bi-droplet-half"></i>

        <h1>Kelola Laundry<br />Lebih Mudah.</h1>

        <p>Mulai dari pencatatan pesanan, pembayaran, monitoring cucian hingga laporan transaksi dalam satu sistem.</p>

        <span>LUNAS — Pesanan Tercatat, Cucian Terpantau.</span>
      </div>
    </div>
  </div>
</template>
