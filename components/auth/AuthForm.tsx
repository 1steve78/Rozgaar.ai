'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import SocialLogin from './SocialLogin';

export default function AuthForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.form-item', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      });
    }, formRef);

    return () => ctx.revert();
  }, [isLogin]);

  return (
    <div ref={formRef} className="p-12">
      <div className="form-item flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-1 flex">
          {['Login', 'Sign Up'].map((label, i) => (
            <button
              key={label}
              onClick={() => setIsLogin(i === 0)}
              className={`px-8 py-2 rounded-full font-medium transition ${
                isLogin === (i === 0)
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <h1 className="form-item text-3xl font-bold text-center mb-6">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>

      <div className="form-item">
        <SocialLogin />
      </div>

      <div className="space-y-4">
        {!isLogin && <Input icon={<User />} placeholder="Full Name" />}

        <Input icon={<Mail />} placeholder="Email" />

        <Input
          icon={<Lock />}
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          rightIcon={
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          }
        />

        {!isLogin && <Input icon={<Lock />} placeholder="Confirm Password" />}

        <button className="form-item w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl mt-4">
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}

function Input({ icon, rightIcon, ...props }: any) {
  return (
    <div className="relative form-item">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:border-indigo-500 outline-none"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        {rightIcon}
      </div>
    </div>
  );
}
