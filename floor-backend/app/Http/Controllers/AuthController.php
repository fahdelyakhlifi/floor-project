<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email'=> $request->email,
            'password'=> Hash::make($request->password)
        ]);

        $token = JWTAuth::fromUser($user);
        return response()->json(compact('user','token'));
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email','password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error'=>'Invalid credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error'=>'Could not create token'], 500);
        }

        return response()->json(compact('token'));
    }

    public function me()
    {
    try {
        $user = Auth::user(); // ✅ utilise Auth::user()
        return response()->json($user);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Utilisateur non authentifié'], 401);
    }

    }

public function logout()
{
    try {
        Auth::logout(); // ✅ déconnexion JWT
        return response()->json(['message' => 'Déconnecté avec succès']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Impossible de se déconnecter'], 500);
    }
}
}
