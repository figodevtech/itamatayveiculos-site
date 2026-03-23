import { getShortsVideos } from "@/services/shorts";
import ShortsClient from "./shorts-client";

export const metadata = {
  title: "Shorts - Veículos",
  description: "Assista aos últimos vídeos dos nossos veículos.",
};

export default async function ShortsPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const params = await searchParams;
  const videos = await getShortsVideos();

  if (params?.v && videos.length > 0) {
    const targetIndex = videos.findIndex((v) => v.id === params.v);
    if (targetIndex > 0) {
      const [target] = videos.splice(targetIndex, 1);
      videos.unshift(target);
    }
  }

  return <ShortsClient initialVideos={videos} />;
}
