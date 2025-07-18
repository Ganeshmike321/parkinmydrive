<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; 


class Register_request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'=>['required', 'min:3','max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
            ],
            'mobile' => [
                'required',
                'number',
                Rule::unique('users', 'mobile')
            ],
            
            'password'=>[
                'required',
                'confirmed'
            ]
            
        ];
    }
}

