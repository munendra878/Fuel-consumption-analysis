import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-100 to-emerald-100 px-4">
      
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Create Your Account
        </h2>
        
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          fallbackRedirectUrl="/dashboard"
        />

        <p className="text-gray-500 text-sm text-center mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-500 hover:text-emerald-600 font-medium"
          >
            Log in
          </a>
        </p>
      </div>

    </div>
  );
}
