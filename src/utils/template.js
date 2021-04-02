import { getBlob } from './ajax'
import { Blob2DataUrl, Blob2Text, getImageDOM } from './blob'

export const resolveTemplate = async data => {
  const standardTemplate = {
    width: 100,
    height: 100,
    thumb: '',
    layer: [],
    imageArea: []
  }
  for (const key in data) {
    if (key === 'layer') {
      const layerList = data[key]
      for (const lid in layerList) {
        const layer = layerList[lid]
        if (layer.type === 'for') {
          for (let i = 0; i < layer.num; i++) {
            standardTemplate.layer.push({ ...layer.item })
            for (const d in layer.delta) {
              layer.item[d] += layer.delta[d]
            }
          }
        } else {
          standardTemplate.layer.push(layer)
        }
      }
      for (const lid in standardTemplate.layer) {
        const layer = standardTemplate.layer[lid]
        if (layer.type === 'staticImage') {
          const imageDat = {}
          try {
            imageDat.blob = await getBlob(layer.url)
          } catch (e) {
            throw new Error(e)
          }
          imageDat.url = await Blob2DataUrl(imageDat.blob)
          layer.img = await getImageDOM(imageDat.url)
        } else if (layer.type === 'userImage') {
          standardTemplate.imageArea.push({
            key: lid,
            x: layer.x,
            y: layer.y,
            xM: layer.x + layer.width,
            yM: layer.y + layer.height
          })
        }
      }
    } else {
      standardTemplate[key] = data[key]
    }
  }
  return standardTemplate
}

export const initTemplateFile = async file => {
  console.log(file)
  if (!/\.template$/i.test(file.name)) {
    return { err: '选择的不是.template文件' }
  }
  const data = JSON.parse(await Blob2Text(file))
  if (!data) {
    return { err: '文件损坏(501)' }
  }
  if (!data.layer) {
    return { err: '文件损坏(502)' }
  }
  return data
}

export const getClickLayer = (imageArea, x, y) => {
  for (const key in imageArea) {
    const layer = imageArea[key]
    if (x >= layer.x && x <= layer.xM && y >= layer.y && y <= layer.yM) {
      return layer.key
    }
  }
  return -1
}
