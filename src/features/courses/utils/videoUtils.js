export const formatHlsUrl = (originalUrl) => {
  if (!originalUrl) return "";
  if (originalUrl.includes(".m3u8")) return originalUrl;

  return originalUrl
    .replace("/uploads/lessons/", "/uploads/hls/lessons/")
    .replace(".mp4", "/master.m3u8");
};
