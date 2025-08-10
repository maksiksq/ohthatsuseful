const jwt = "beans";

export const checkJWT = (header: string | null): boolean => {
    if (!header) return false;
    const token = header.replace(/^Bearer\s+/i, '');
    return token === jwt;
}