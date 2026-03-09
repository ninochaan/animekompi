import type {
    HomeResponse,
    DetailResponse,
    WatchResponse,
    ScheduleResponse,
    SearchResponse,
    BatchResponse,
} from './types';

// Wajik Anime API - Multi-source anime API (Otakudesu source)
const BASE_URL = 'https://wajik-anime-api.vercel.app/otakudesu';

async function fetchAPI<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        next: { revalidate: 60 },
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }

    return res.json();
}

// Transform Wajik API response to match our types
function transformAnimeList(data: any, page: number = 1): any {
    if (!data || !data.data) return { status: 'error', data: { page: 1, total_pages: 1, anime: [] } };
    
    const animeList = Array.isArray(data.data) ? data.data : (data.data.animeList || data.data.anime || []);
    return {
        status: 'success',
        data: {
            page: data.pagination?.currentPage || page,
            total_pages: data.pagination?.totalPages || 10,
            anime: animeList.map((item: any) => ({
                slug: item.slug || item.endpoint || item.animeId || '',
                title: item.title || item.name || '',
                thumbnail: item.poster || item.thumbnail || item.image || '',
                type: item.type || item.status || 'TV',
                latest_episode: item.episodeNew || item.episode || item.latestEpisode || '',
                episode: item.episodeNew || item.episode || '',
                release_time: item.releaseDay || item.updatedAt || item.release || '',
            }))
        }
    };
}

export async function getHome(page: number = 1): Promise<HomeResponse> {
    const data = await fetchAPI<any>(`/ongoing?page=${page}`);
    return transformAnimeList(data, page);
}

export async function getDetail(slug: string): Promise<DetailResponse> {
    const data = await fetchAPI<any>(`/anime/${slug}`);
    
    if (!data || !data.data) {
        throw new Error('Anime not found');
    }

    const detail = data.data;
    return {
        status: 'success',
        data: {
            title: detail.title || detail.name || '',
            thumbnail: detail.poster || detail.thumbnail || detail.image || '',
            synopsis: detail.synopsis || detail.sinopsis || detail.description || '',
            info: {
                status: detail.status || '',
                studio: detail.studio || '',
                dirilis: detail.released || detail.release || detail.releaseDate || '',
                durasi: detail.duration || detail.episodeDuration || '',
                season: detail.season || '',
                tipe: detail.type || '',
                censor: detail.censor || '',
                diposting_oleh: detail.postedBy || detail.author || '',
                diperbarui_pada: detail.updatedAt || detail.updatedOn || '',
                genres: detail.genreList?.map((g: any) => g.title || g.name || g) || detail.genres || [],
            },
            episodes: (detail.episodeList || detail.episodes || []).map((ep: any) => ({
                slug: ep.slug || ep.endpoint || ep.episodeId || '',
                episode: ep.title || ep.episode || ep.episodeNumber || '',
                title: ep.title || ep.episode || '',
                date: ep.releasedOn || ep.date || ep.uploadedAt || '',
            }))
        }
    };
}

export async function getWatch(slug: string): Promise<WatchResponse> {
    const data = await fetchAPI<any>(`/episode/${slug}`);
    
    if (!data || !data.data) {
        throw new Error('Episode not found');
    }

    const episode = data.data;
    return {
        status: 'success',
        data: {
            title: episode.title || episode.episodeTitle || '',
            streaming_servers: (episode.streamingUrls || episode.serverList || episode.servers || []).map((server: any) => ({
                name: server.name || server.serverName || server.quality || 'Default',
                type: server.type || 'iframe',
                url: server.url || server.src || server.streamUrl || '',
            })),
            download_links: (episode.downloadUrls || episode.downloads || episode.downloadList || []).map((dl: any) => ({
                quality: dl.resolution || dl.quality || dl.title || '',
                links: (dl.urls || dl.links || []).map((link: any) => ({
                    provider: link.name || link.title || link.provider || 'Unknown',
                    url: link.url || link.link || '',
                }))
            }))
        }
    };
}

export async function getSchedule(): Promise<ScheduleResponse> {
    const data = await fetchAPI<any>('/schedule');
    
    if (!data || !data.data) {
        return { status: 'success', data: {} };
    }

    const scheduleList = data.data.scheduleList || data.data || [];
    const transformedSchedule: { [key: string]: any[] } = {};

    if (Array.isArray(scheduleList)) {
        scheduleList.forEach((daySchedule: any) => {
            const day = daySchedule.day || daySchedule.title || 'Unknown';
            transformedSchedule[day] = (daySchedule.animeList || daySchedule.anime || []).map((item: any) => ({
                slug: item.slug || item.endpoint || item.animeId || '',
                title: item.title || item.name || '',
                thumbnail: item.poster || item.thumbnail || '',
                type: item.type || 'TV',
                latest_episode: item.episode || '',
                release_time: item.time || item.releaseTime || '',
            }));
        });
    }

    return {
        status: 'success',
        data: transformedSchedule
    };
}

export async function search(query: string, page: number = 1): Promise<SearchResponse> {
    const data = await fetchAPI<any>(`/search?q=${encodeURIComponent(query)}`);
    const transformed = transformAnimeList(data, page);
    return {
        ...transformed,
        data: {
            ...transformed.data,
            query: query
        }
    };
}

export async function getBatch(page: number = 1): Promise<BatchResponse> {
    const data = await fetchAPI<any>(`/completed?page=${page}`);
    return transformAnimeList(data, page);
}