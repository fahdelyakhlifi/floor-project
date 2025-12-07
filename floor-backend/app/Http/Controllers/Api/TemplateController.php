<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Template;

class TemplateController extends Controller
{

    public function index()
    {
        return Template::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'canvasSize'    => 'nullable|integer',
            'palette'       => 'required|array',
            'patternParams' => 'required|array',
            'thumbnail'     => 'nullable|string',
        ]);

        $template = Template::create([
            'name'          => $data['name'],
            'canvas_size'   => $data['canvasSize'] ?? 500,
            'palette'       => $data['palette'],
            'pattern_params'=> $data['patternParams'],
            'thumbnail'     => $data['thumbnail'] ?? null,
        ]);

        return response()->json($template, 201);
    }

    public function destroy($id)
    {
        $tpl = Template::findOrFail($id);
        $tpl->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
