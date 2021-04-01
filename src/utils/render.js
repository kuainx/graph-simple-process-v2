export const renderImage = template => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', template.width)
  canvas.setAttribute('height', template.height)
  const ctx = canvas.getContext('2d')
  for (const key in template.layer) {
    const item = template.layer[key]
    if (item.type === 'staticImage' || item.type === 'userImage') {
      ctx.drawImage(item.raw, item.x, item.y, item.width, item.height)
    }
  }
}
