'use client';

export const dynamic = 'force-dynamic';

import LenisProvider from '@/components/providers/LenisProvider';
import CustomCursor from '@/components/providers/CustomCursor';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hotels from '@/components/sections/Hotels';
import React from 'react';

class HotelsErrorBoundary extends React.Component<{children: React.ReactNode}, {error: string|null}> {
  constructor(props: {children: React.ReactNode}) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) return <div className="p-8 text-red-400 text-sm">Hotels error: {this.state.error}</div>;
    return this.props.children;
  }
}

export default function HotelsPage() {
  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col pt-20">
        <HotelsErrorBoundary>
          <Hotels standalone />
        </HotelsErrorBoundary>
      </main>
      <Footer />
    </LenisProvider>
  );
}
