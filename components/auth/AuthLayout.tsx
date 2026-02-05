'use client';

import AuthFeatures from './AuthFeatures';
import AuthForm from './AuthForm';
import SocialLogin from './SocialLogin';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 p-6">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left side - Features */}
          <AuthFeatures />
          
          {/* Right side - Auth Form */}
          <div className="p-10 flex flex-col justify-center">
            <AuthForm />
            
            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            {/* Social Login */}
            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
}