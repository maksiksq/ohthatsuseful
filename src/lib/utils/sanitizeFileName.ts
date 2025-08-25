export const sanitizeFileName = (name: string): string => {
    return encodeURIComponent(name);
}