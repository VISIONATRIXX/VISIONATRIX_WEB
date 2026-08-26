import { Project } from "@/types/admin";

export const isVideoUrl = (url?: string | null): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  if (!lower) return false;

  // Embedded video platforms
  if (
    lower.includes("vimeo.com") ||
    lower.includes("youtube.com") ||
    lower.includes("youtu.be")
  ) {
    return true;
  }

  // Direct video file extensions
  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".m4v") ||
    lower.endsWith(".ogv") ||
    lower.endsWith(".m3u8")
  ) {
    return true;
  }

  // Data URLs or URLs containing video indicators
  if (
    lower.startsWith("data:video/") ||
    lower.includes(".mp4?") ||
    lower.includes(".webm?") ||
    lower.includes(".mov?")
  ) {
    return true;
  }

  return false;
};

export const getProjectVideoUrl = (project?: Project | null): string | null => {
  if (!project) return null;

  // 1. Check details.videoUrl if explicitly defined and valid
  if (project.details?.videoUrl && project.details.videoUrl.trim()) {
    return project.details.videoUrl.trim();
  }

  // 2. Check if project.image is a video URL (e.g., uploaded video saved into image)
  if (project.image && isVideoUrl(project.image)) {
    return project.image.trim();
  }

  return null;
};

export const getProjectThumbnailUrl = (project?: Project | null): string | null => {
  if (!project) return null;

  // 1. If project has a custom uploaded/provided image URL
  if (project.image && project.image.trim() && !isVideoUrl(project.image)) {
    return project.image.trim();
  }

  // 2. If project has a live website URL, generate a real-time site preview thumbnail via thum.io
  if (project.details?.liveUrl && project.details.liveUrl.trim()) {
    const rawUrl = project.details.liveUrl.trim();
    const target = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
    return `https://image.thum.io/get/width/800/crop/500/noanimate/${target}`;
  }

  return null;
};

export const getVideoEmbedUrl = (url: string) => {
  // Sanitize: only allow https: URLs (reject javascript:, data:, etc.)
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "";
    }
  } catch {
    return "";
  }

  if (url.includes("vimeo.com")) {
    const reg = /video\/(\d+)/;
    const match = url.match(reg);
    const id = match ? match[1] : url.split("/").pop()?.split("?")[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&muted=1&background=1&autopause=0`;
  }
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let id = "";
    if (url.includes("youtu.be")) {
      id = url.split("/").pop()?.split("?")[0] || "";
    } else if (url.includes("embed/")) {
      id = url.split("embed/")[1].split("?")[0];
    } else {
      const match = url.match(/[?&]v=([^&#]+)/);
      id = match ? match[1] : "";
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;
  }
  return url;
};
