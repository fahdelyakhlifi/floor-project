<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name'); //Template name
            $table->string('category')->nullable();
            $table->unsignedInteger('canvas_size')->default(500);
            $table->json('palette');  // array colors
            $table->json('pattern_params'); // shapeType, seed, size, ..
            $table->longText('thumbnail')->nullable(); // image PNG
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
