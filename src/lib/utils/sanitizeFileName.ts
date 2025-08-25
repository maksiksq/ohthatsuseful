export const sanitizeFileName = (name: string): string => {
    return name
        .replace(/[^a-zA-Z0-9._\-\s/]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^[_\s]+|[_\s]+$/g, "");
};