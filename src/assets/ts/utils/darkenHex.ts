function darkenHex(hex: string, percent = 20) {
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)

  r = Math.max(0, Math.floor(r * (100 - percent) / 100))
  g = Math.max(0, Math.floor(g * (100 - percent) / 100))
  b = Math.max(0, Math.floor(b * (100 - percent) / 100))

  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}


export default darkenHex;