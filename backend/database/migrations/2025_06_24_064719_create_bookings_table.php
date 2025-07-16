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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('parking_spot_id')->constrained('parking_spots')->onDelete('cascade');
            $table->dateTime('from_datetime');
            $table->dateTime('to_datetime');
            $table->string('vehicle_name');
            $table->string('vehicle_number');
            $table->decimal('amount_paid', 8, 2);
            $table->dateTime('booked_on');
            $table->integer('total_hours');
            $table->string('status')->default('booked');
            $table->string('location')->nullable();
            $table->string('payment_id')->nullable();
            $table->dateTime('payed_on')->nullable();
            $table->string('payment_method')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
