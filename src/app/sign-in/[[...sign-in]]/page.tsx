'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02122d]">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-semibold text-white mb-1"
            style={{ fontFamily: 'var(--font-instrument)' }}
          >
            PoliTrip
          </h1>
          <p className="text-sm text-white/50">Admin Dashboard</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm rounded-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-white/60',
              formFieldLabel: 'text-white/80',
              formFieldInput:
                'bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40',
              formButtonPrimary:
                'bg-cyan-500 hover:bg-cyan-400 text-white font-medium',
              footerActionLink: 'text-cyan-400 hover:text-cyan-300',
              identityPreviewText: 'text-white',
              identityPreviewEditButton: 'text-cyan-400',
            },
          }}
        />
      </div>
    </div>
  );
}
