'use client'
import React, { useEffect } from 'react';
import Header from './Header';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
   const router = useRouter();
    const { isAuthenticated } = useAuthStore();
     const path = usePathname();
    
     useEffect(() => {
      if(!isAuthenticated) return router.push(path)
        if (isAuthenticated && path.includes('login') || path.includes('register')) {
          
          router.push('/dashboard');
        }
      }, [isAuthenticated, router,path]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2023 Notes App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
