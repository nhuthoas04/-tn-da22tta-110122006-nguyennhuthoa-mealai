const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const backendOrigin = apiBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

export function getRecipeImageUrl(imageUrl?: string | null) {
  const value = imageUrl?.trim();
  if (!value) return '';

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${backendOrigin}${value}`;
  }

  if (value.startsWith('uploads/')) {
    return `${backendOrigin}/${value}`;
  }

  return `${backendOrigin}/uploads/recipes/${value}`;
}
