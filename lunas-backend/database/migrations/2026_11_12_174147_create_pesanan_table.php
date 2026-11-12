
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    if (!Schema::hasTable('pesanan')) {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pesanan', 30)->unique();
            $table->foreignId('pelanggan_id')->constrained('pelanggan')->restrictOnDelete();
            $table->foreignId('layanan_id')->constrained('layanan')->restrictOnDelete();
            $table->decimal('jumlah', 8, 2);
            $table->decimal('total_harga', 12, 2);
            $table->date('tanggal_masuk');
            $table->date('estimasi_selesai')->nullable();
            $table->string('status')->default('Menunggu');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }
}
    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
