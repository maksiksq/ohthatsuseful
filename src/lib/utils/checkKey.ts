import {SECRET_API_CONTROL_KEY} from "$env/static/private";

export const checkKey = (header: string | null): boolean => {
    if (!header) return false;
    const token = header.replace(/^Bearer\s+/i, '');
    return token === SECRET_API_CONTROL_KEY;
}