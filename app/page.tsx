'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import Link from 'next/link';
import { FiEdit3, FiUsers, FiClock } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
   const path = usePathname();
  
  //  useEffect(() => {
  //     if (isAuthenticated && path.includes('login') || path.includes('register')) {
        
  //       router.push('/dashboard');
  //     }
  //   }, [isAuthenticated, router,path]);

  return (
    <div className="bg-white">
      {/* Hero section */}
      
      <div className="relative isolate px-6 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-blue-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-26">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Collaborate on notes in real-time
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create, edit, and share notes with your team. See changes as they happen and collaborate seamlessly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/login"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Log in <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Take better notes</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for collaborative note-taking
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our notes app provides a seamless experience for teams to work together on shared documents in real-time.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <FiEdit3 className="h-6 w-6 text-white" />
                  </div>
                  Rich Markdown Support
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Write notes using Markdown syntax with real-time preview to format your content beautifully.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <FiUsers className="h-6 w-6 text-white" />
                  </div>
                  Real-time Collaboration
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Collaborate with team members in real-time and see their changes as they type.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <FiClock className="h-6 w-6 text-white" />
                  </div>
                  Version History
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Keep track of changes with automatic version history and restore previous versions if needed.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
