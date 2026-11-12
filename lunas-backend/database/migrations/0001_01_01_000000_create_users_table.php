
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel users sudah dibuat melalui phpMyAdmin.
        // Tidak perlu dibuat ulang oleh Laravel.
    }

    public function down(): void
    {
        // Jangan menghapus tabel users yang sudah ada.
    }
};
