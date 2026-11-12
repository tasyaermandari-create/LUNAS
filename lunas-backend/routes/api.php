
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LayananController;
use App\Http\Controllers\Api\PelangganController;
use App\Http\Controllers\Api\PesananController;
use App\Http\Controllers\Api\PembayaranController;

Route::get('/layanan', [LayananController::class, 'index']);

Route::get('/pelanggan', [PelangganController::class, 'index']);
Route::post('/pelanggan', [PelangganController::class, 'store']);

Route::get('/pesanan', [PesananController::class, 'index']);
Route::post('/pesanan', [PesananController::class, 'store']);
Route::get('/pesanan/{kode}', [PesananController::class, 'show']);
Route::patch('/pesanan/{id}/status', [PesananController::class, 'updateStatus']);

Route::post('/pembayaran', [PembayaranController::class, 'store']);
