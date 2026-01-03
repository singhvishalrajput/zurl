import axiosInstance from "../utils/axiosinstance";

export const createShortUrl = async (url, slug = null) => {
    const {data} = await axiosInstance.post('/api/create', { url, slug });
    return data.shortUrl;
}

export const checkSlugAvailability = async (slug) => {
    const { data } = await axiosInstance.get(`/api/create/check/${slug}`);
    return data;
}

export const getMyUrls = async (cursor = null, limit = 10) => {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    const { data } = await axiosInstance.get('/api/create/my-urls', { params });
    return data;
}