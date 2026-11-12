
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    protected $table = 'pesanan';

    protected $fillable = [
        'kode_pesanan',
        'pelanggan_id',
        'layanan_id',
        'jumlah',
        'total_harga',
        'tanggal_masuk',
        'estimasi_selesai',
        'status',
        'catatan'
    ];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'pelanggan_id');
    }

    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'layanan_id');
    }

    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class, 'pesanan_id');
    }

    public function riwayatStatus()
    {
        return $this->hasMany(RiwayatStatus::class, 'pesanan_id');
    }
}
