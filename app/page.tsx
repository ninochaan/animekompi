import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getHome } from '@/lib/api';
import { HeroSlider } from '@/components/hero-slider';
import { InfiniteAnimeGrid } from '@/components/infinite-anime-grid';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nonton Anime Subtitle Indonesia Terbaru',
  description: 'Streaming anime subtitle Indonesia terbaru dan terlengkap. Update setiap hari dengan kualitas HD. Nonton anime ongoing, completed, dan download batch gratis.',
  openGraph: {
    title: 'AnimeKompi - Nonton Anime Subtitle Indonesia Terbaru',
    description: 'Streaming anime subtitle Indonesia terbaru dan terlengkap. Update setiap hari dengan kualitas HD.',
    url: 'https://animekompi.fun',
    type: 'website',
  },
};

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <AlertCircle className="w-16 h-16 text-slate-600 mb-4" />
      <h2 className="text-xl font-semibold text-slate-300 mb-2">Gagal Memuat Data</h2>
      <p className="text-slate-500 mb-6 max-w-md">{message}</p>
      <a
        href="/"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Lagi
      </a>
    </div>
  );
}

async function HomeContent() {
  let animeList = [];
  let fetchError = '';

  try {
    const data = await getHome(1);
    animeList = data.data.anime || [];
  } catch (error) {
    console.error('HomeContent fetch error:', error);
    fetchError = 'Tidak dapat memuat daftar anime. Pastikan koneksi internet Anda stabil dan coba lagi.';
  }

  if (fetchError || animeList.length === 0) {
    return (
      <EmptyState
        message={fetchError || 'Tidak ada data anime yang tersedia saat ini. Silakan coba beberapa saat lagi.'}
      />
    );
  }

  const trending = animeList.slice(0, 5);

  return (
    <>
      {/* Hero Section */}
      <section className="mb-8">
        <HeroSlider animeList={trending} />
      </section>

      {/* Latest Updates */}
      <section className="container mx-auto px-4 mb-12">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          Latest Anime Updates - Subtitle Indonesia
        </h1>
        <InfiniteAnimeGrid initialAnime={animeList} initialPage={1} />
      </section>
    </>
  );
}

function HomeLoading() {
  return (
    <>
      <div className="h-64 md:h-[500px] bg-slate-900 animate-pulse" />
      <section className="container mx-auto px-4 mb-12 mt-8">
        <div className="h-8 w-48 bg-slate-900 rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-slate-900 animate-pulse rounded-xl" />
          ))}
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
