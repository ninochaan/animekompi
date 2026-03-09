import type {
    HomeResponse,
    DetailResponse,
    WatchResponse,
    ScheduleResponse,
    SearchResponse,
    BatchResponse,
} from './types';

const BASE_URL = 'https://otakudesu-anime-api.vercel.app/api/v1';

async function fetchAPI<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }

    return res.json();
}

// Transform Otakudesu response to match our types
function transformAnimeList(data: any): any {
    if (!data || !data.data) return { status: 'error', data: { page: 1, total_pages: 1, anime: [] } };
    
    const animeList = Array.isArray(data.data) ? data.data : [];
    return {
        status: 'success',
        data: {
            page: 1,
            total_pages: 10,
            anime: animeList.map((item: any) => ({
                slug: item.endpoint || item.slug || '',
                title: item.title || '',
                thumbnail: item.thumbnail || item.poster || '',
                type: item.type || 'TV',
                latest_episode: item.episode || item.latest_episode || '',
                episode: item.episode || '',
                release_time: item.release || item.updated_on || '',
            }))
        }
    };
}

export async function getHome(page: number = 1): Promise<HomeResponse> {
    const data = await fetchAPI<any>(`/ongoing/${page}`);
    return transformAnimeList(data);
}

export async function getDetail(slug: string): Promise<DetailResponse> {
    const data = await fetchAPI<any>(`/detail/${slug}`);
    
    if (!data || !data.data) {
        throw new Error('Anime not found');
    }

    const detail = data.data;
    return {
        status: 'success',
        data: {
            title: detail.title || '',
            thumbnail: detail.thumbnail || detail.poster || '',
            synopsis: detail.synopsis || detail.sinopsis || '',
            info: {
                status: detail.status || '',
                studio: detail.studio || '',
                dirilis: detail.release || detail.released || '',
                durasi: detail.duration || '',
                season: detail.season || '',
                tipe: detail.type || '',
                censor: detail.censor || '',
                diposting_oleh: detail.posted_by || '',
                diperbarui_pada: detail.updated_on || '',
                genres: detail.genres || [],
            },
            episodes: (detail.episodes || detail.episode_list || []).map((ep: any) => ({
                slug: ep.endpoint || ep.slug || '',
                episode: ep.episode || ep.title || '',
                title: ep.title || ep.episode || '',
                date: ep.date || ep.uploaded_at || '',
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
            title: episode.title || '',
            streaming_servers: (episode.streaming || episode.stream_url || []).map((server: any) => ({
                name: server.name || server.quality || 'Default',
                type: server.type || 'iframe',
                url: server.url || server.iframe_url || '',
            })),
            download_links: (episode.download || episode.downloads || []).map((dl: any) => ({
                quality: dl.quality || dl.resolution || '',
                links: (dl.links || dl.urls || []).map((link: any) => ({
                    provider: link.name || link.provider || 'Unknown',
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

    const schedule = data.data;
    const transformedSchedule: { [key: string]: any[] } = {};

    Object.keys(schedule).forEach(day => {
        transformedSchedule[day] = (schedule[day] || []).map((item: any) => ({
            slug: item.endpoint || item.slug || '',
            title: item.title || '',
            thumbnail: item.thumbnail || item.poster || '',
            type: item.type || 'TV',
            latest_episode: item.episode || '',
            release_time: item.time || '',
        }));
    });

    return {
        status: 'success',
        data: transformedSchedule
    };
}

export async function search(query: string, page: number = 1): Promise<SearchResponse> {
    const data = await fetchAPI<any>(`/search/${encodeURIComponent(query)}`);
    const transformed = transformAnimeList(data);
    return {
        ...transformed,
        data: {
            ...transformed.data,
            query: query
        }
    };
}

export async function getBatch(page: number = 1): Promise<BatchResponse> {
    const data = await fetchAPI<any>(`/completed/${page}`);
    return transformAnimeList(data);
}