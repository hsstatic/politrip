'use client';

import dynamic from 'next/dynamic';

const Hotels = dynamic(() => import('@/components/sections/Hotels'), { ssr: false });

export default function HomeHotels() {
  return <Hotels />;
}
