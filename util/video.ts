export async function getVideoPreviewUrl(videoUrl: string): Promise<string | null> {
  const youtubePreviewUrl = getYouTubePreviewUrl(videoUrl)
  if (youtubePreviewUrl) return youtubePreviewUrl

  const vimeoPreviewUrl = await getVimeoPreviewUrl(videoUrl)
  if (vimeoPreviewUrl) return vimeoPreviewUrl

  return null
}

// ===== Platforms

// -- YouTube
function getYouTubeVideoId(videoUrl: string): string | null {
  const idRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi
  const matches = idRegex.exec(videoUrl)
  if (!matches || matches.length !== 2) {
    return null
  }
  return matches[1]
}

function getYouTubePreviewUrl(videoUrl: string): string | null {
  const videoId = getYouTubeVideoId(videoUrl)
  if (!videoId) {
    return null
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

// -- Vimeo
function getVimeoVideoId(videoUrl: string): string | null {
  const idRegex = /(?:http:|https:|)\/\/(?:player.|www.)?vimeo\.com\/(?:video\/|embed\/|watch\?\S*v=|v\/)?(\d*)/gi
  const matches = idRegex.exec(videoUrl)
  if (!matches || matches.length !== 2) {
    return null
  }
  return matches[1]
}

async function getVimeoPreviewUrl(videoUrl: string): Promise<string | null> {
  const videoId = getVimeoVideoId(videoUrl)
  if (!videoId) {
    return null
  }
  const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
  const responseJson = await response.json()
  if (!responseJson.length || !responseJson[0].thumbnail_large) {
    return null
  }
  return responseJson[0].thumbnail_large
}
