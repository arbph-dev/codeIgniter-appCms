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
        Schema::create('formesjuridiques', function (Blueprint $table) {
            $table->string('id', 10)->primary()->comment('Code INSEE de la forme juridique');
            $table->string('nom', 100)->nullable()->comment('Nom court/résumé de la forme juridique');
            $table->text('description')->comment('Libellé complet INSEE');
            $table->timestamps();
            
            $table->index('nom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formesjuridiques');
    }
};