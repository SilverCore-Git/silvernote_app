
export async function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = imageUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject('Impossible de créer le contexte canvas')

      ctx.drawImage(img, 0, 0, img.width, img.height)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data

      const colorCount: Record<string, number> = {}

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]

        if (a < 128) continue

        const key = `${r},${g},${b}`
        colorCount[key] = (colorCount[key] || 0) + 1
      }

      let maxCount = 0
      let dominantColor = '0,0,0'

      for (const key in colorCount) {
        if (colorCount[key] > maxCount) {
          maxCount = colorCount[key]
          dominantColor = key
        }
      }

      const [r, g, b] = dominantColor.split(',').map(Number)
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
      resolve(hex)
      
    }

    img.onerror = (err) => reject(err)
  })
}
