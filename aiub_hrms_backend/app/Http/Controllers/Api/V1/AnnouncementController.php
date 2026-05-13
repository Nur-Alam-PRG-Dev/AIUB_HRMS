<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller {
    use ApiResponse;
    public function index(Request $request) {
        $query = Announcement::with('creator')->when(!$request->user()->hasRole(['super_admin','hr_admin']),fn($q)=>$q->published())->latest();
        return $this->success($query->paginate(10)->items());
    }
    public function store(Request $request) {
        $data = $request->validate(['title'=>'required|string|max:255','body'=>'required|string','audience'=>'required|in:all,hr_admin,manager,employee','is_published'=>'boolean']);
        $data['created_by']=$request->user()->id;
        if($data['is_published']??false) $data['published_at']=now();
        return $this->created(Announcement::create($data)->load('creator'),'Announcement created');
    }
    public function show(Announcement $announcement) { return $this->success($announcement->load('creator')); }
    public function update(Request $request, Announcement $announcement) {
        $data = $request->validate(['title'=>'sometimes|string|max:255','body'=>'sometimes|string','audience'=>'sometimes|in:all,hr_admin,manager,employee','is_published'=>'sometimes|boolean']);
        if(isset($data['is_published'])&&$data['is_published']&&!$announcement->published_at) $data['published_at']=now();
        $announcement->update($data);
        return $this->success($announcement,'Announcement updated');
    }
    public function destroy(Announcement $announcement) { $announcement->delete(); return $this->success(null,'Announcement deleted'); }
}
