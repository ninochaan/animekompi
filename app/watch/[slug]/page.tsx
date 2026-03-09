import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWatch, getDetail } from '@/lib/api';
import { VideoPlayer } from '@/components/video-player';
import { getAnimeSlugFromEpisode } from '@/lib/utils-episode';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const response = await getWatch(slug);
        const data = response.data;

        return {
            title: `${data.title} - Nonton Anime Sub Indo`,
            description: `Nonton ${data.title} subtitle Indonesia terbaru dengan kualitas HD. Streaming dan download anime sub Indo gratis di AnimeKompi.`,
            keywords: [
                data.title,
                `nonton ${data.title}`,
                `${data.title} sub indo`,
                'anime subtitle indonesia',
                'streaming anime',
                'nonton anime gratis',
            ],
            openGraph: {
                title: `${data.title} - AnimeKompi`,
                description: `Nonton ${data.title} subtitle Indonesia terbaru dengan kualitas HD.`,
                type: 'video.episode',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${data.title} - AnimeKompi`,
                description: `Nonton ${data.title} subtitle Indonesia terbaru dengan kualitas HD.`,
            },
        };
    } catch {
        return {
            title: 'Episode Not Found',
        };
    }
}

async function WatchContent({ slug }: { slug: string }) {
    try {
        const response = await getWatch(slug);
        const data = response.data;

        // Try to get anime slug and episode list for navigation
        const animeSlug = getAnimeSlugFromEpisode(slug);
        let prevEpisode: string | null = null;
        let nextEpisode: string | null = null;

        try {
            const detailResponse = await getDetail(animeSlug);
            const episodes = detailResponse.data.episodes;

            // Find current episode index
            const currentIndex = episodes.findIndex(ep => ep.slug === slug);

            if (currentIndex !== -1) {
                // Previous episode (index + 1 because episodes are usually in reverse order)
                if (currentIndex < episodes.length - 1) {
                    prevEpisode = episodes[currentIndex + 1].slug;
                }
                // Next episode (index - 1)
                if (currentIndex > 0) {
                    nextEpisode = episodes[currentIndex - 1].slug;
                }
            }
        } catch (error) {
            // If we can't get episode list, navigation buttons will be disabled
            console.error('Could not fetch episode list:', error);
        }

        // JSON-LD Structured Data
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: data.title,
            description: `Nonton ${data.title} subtitle Indonesia terbaru dengan kualitas HD.`,
            uploadDate: new Date().toISOString(),
        };

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="text-sm text-gray-400 mb-4 flex gap-2">
                            <Link href="/" className="hover:text-purple-400">Home</Link>
                            <span>/</span>
                            <Link href={`/anime/${animeSlug}`} className="hover:text-purple-400">Detail</Link>
                            <span>/</span>
                            <span className="text-white truncate">{data.title}</span>
                        </div>

                        {/* Video Player with Navigation */}
                        <VideoPlayer
                            title={data.title}
                            servers={data.streaming_servers}
                            downloads={data.download_links}
                            prevEpisode={prevEpisode}
                            nextEpisode={nextEpisode}
                            animeSlug={animeSlug}
                        />
                    </div>
                </div>
            </>
        );
    } catch (error) {
        notFound();
    }
}

function WatchLoading() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto animate-pulse">
                <div className="w-full aspect-video bg-slate-900 rounded-xl mb-6" />
                <div className="h-8 w-1/2 bg-slate-900 rounded mb-4" />
            </div>
        </div>
    );
}

export default async function WatchPage({ params }: Props) {
    const { slug } = await params;

    return (
        <Suspense fallback={<WatchLoading />}>
            <WatchContent slug={slug} />
        </Suspense>
    );
}
