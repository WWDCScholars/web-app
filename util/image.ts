import Pica from 'pica/dist/pica'

export function loadFile(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = (readerEvent) => {
      resolve(readerEvent.target?.result as string)
    }

    reader.readAsDataURL(file)
  })
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise(async resolve => {
    const image = new Image()
    image.onload = (imageEvent) => {
      resolve(image)
    }

    image.src = await loadFile(file)
  })
}

export async function resizeImage(file: File, maxSize: number): Promise<Blob> {
  const image = await loadImage(file)

  const canvas = document.createElement('canvas')
  const targetSize = calculateSize(image.width, image.height, maxSize)
  canvas.width = targetSize.width
  canvas.height = targetSize.height

  const pica = new Pica()
  const result = await pica.resize(image, canvas)
  return pica.toBlob(result, 'image/jpeg', 0.90)
}

/**
 * Calculate the maximum width and height while keeping the larger value within maxValue and preserving the ratio between width and height.
 * @param width Reference width.
 * @param height Reference height.
 * @param maxValue Maxiumum size for the larger value of width or height.
 * @returns Scaled width and height.
 */
function calculateSize(width: number, height: number, maxValue: number): { width: number; height: number } {
  if (maxValue === 0) {
    return { width, height }
  }

  if (width > height && width > maxValue) {
    height *= maxValue / width
    width = maxValue
  } else if (height > maxValue) {
    width *= maxValue / height
    height = maxValue
  }

  return { width, height }
}
