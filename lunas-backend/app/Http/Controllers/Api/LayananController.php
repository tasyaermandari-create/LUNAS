
namespace App\Http\Controllers\Api;

use App\Models\Layanan;

class LayananController
{
    public function index()
    {
        $layanan = Layanan::all();

        return response()->json([
            'success' => true,
            'message' => 'Data layanan berhasil diambil',
            'data' => $layanan
        ]);
    }
}
