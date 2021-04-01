import { getImageDOM } from './blob'

export const renderImage = template => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', template.width)
  canvas.setAttribute('height', template.height)
  const ctx = canvas.getContext('2d')
  for (const key in template.layer) {
    const item = template.layer[key]
    if (item.type === 'staticImage' || item.type === 'userImage') {
      ctx.drawImage(item.img, item.x, item.y, item.width, item.height)
    }
  }
  return canvas.toDataURL()
}

const getRandClr = () => {
  var r = Math.floor(Math.random() * 256)
  var g = Math.floor(Math.random() * 256)
  var b = Math.floor(Math.random() * 256)
  if (0.299 * r + 0.587 * g + 0.114 * b < 180) {
    return getRandClr()
  } else {
    return `rgb(${r},${g},${b})`
  }
}

const getEmptyImg = async (width, height) => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = getRandClr()
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'black'
  const fontSize = Math.min(width, height) * 0.15
  ctx.font = fontSize + 'px Times New Roman'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${width} x ${height}`, width / 2, height / 2, width * 0.8)
  const dataUrl = canvas.toDataURL()
  return await getImageDOM(dataUrl)
}

export const getPreview = async template => {
  const tdata = { ...template }
  for (const key in tdata.layer) {
    const layer = tdata.layer[key]
    if (!layer.img) {
      layer.img = await getEmptyImg(layer.width, layer.height)
    }
  }
  return renderImage(tdata)
}
