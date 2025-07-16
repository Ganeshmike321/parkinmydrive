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
        Schema::create('cancelled_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->enum('cancelled_by', ['user', 'owner']); // e.g., 'user' or 'owner'
            $table->integer('total_hours');
            $table->dateTime('cancelled_date');
            $table->enum('refund_status', ['completed', 'pending'])->default('pending');
            $table->text('reason')->nullable();
            $table->decimal('refund_amount', 8, 2)->default(0);
            $table->dateTime('refund_on')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancelled_bookings');
    }
};
