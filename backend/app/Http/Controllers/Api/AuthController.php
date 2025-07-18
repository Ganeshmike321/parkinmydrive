<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use Illuminate\Validation\Rule; 
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\Register_request ;
use App\Http\Requests\Login_request ;
// use Illuminate\Http\JsonResponse;


class AuthController extends Controller
{
    // User or Owner Registration
    public function register(Request $request)
    {
      
        $validator = Validator::make($request->all(), [
            'name'=>['required', 'min:3','max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
            ],
            'mobile' => [
                'required',
                'numeric',
                Rule::unique('users', 'mobile')
            ],
            
            'password'=>[
                'required',
                'confirmed'
            ]
        ]);
        if ($validator->fails()) {
            $validation_error = validation_api_errors_message($validator->errors()->messages());
             return $this->sendapiError($validation_error,400);
         }

     $user = new  User();
     $user-> name = $request->name;
     $user-> email = $request->email;
     $user-> mobile = $request->mobile;
     $user-> password = Hash::make($request->password);
     $user->save();



     return $this->sendResponse([],'User Created Successfully.',200); 
     }

    // Login with email/password
    public function login(Login_request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = \App\Models\User::where('email', $credentials['email'])->first();

        if (!$user || !\Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid credentials'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => $user->only(['id', 'name', 'email', 'mobile', 'role']),
            'message' => 'User logged in successfully.'
        ], 200);
    }

    // Logout current session
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    // Request password reset email
    public function sendPasswordResetEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink(
            $request->only('email')
        );
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent'])
            : response()->json(['message' => 'Unable to send reset link'], 400);
    }
} 



