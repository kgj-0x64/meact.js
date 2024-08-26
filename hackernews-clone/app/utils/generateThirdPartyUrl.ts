export function generateHnUrl(query: string): string {
  const baseUrl = "https://hn.algolia.com/";
  const encodedQuery = encodeURIComponent(query);
  const fullUrl = `${baseUrl}?query=${encodedQuery}&type=story&dateRange=all&sort=byDate&storyText=false&prefix&page=0`;
  return fullUrl;
}
