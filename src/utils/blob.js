export const Blob2DataUrl = async blob => {
  return new Promise(function (resolve) {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function () {
      resolve(reader.result)
    }
  })
}

export const Blob2Text = async blob => {
  return new Promise(function (resolve) {
    const reader = new FileReader()
    reader.readAsText(blob)
    reader.onload = function () {
      resolve(reader.result)
    }
  })
}

export const getImageDOM = async url => {
  return new Promise(function (resolve) {
    const image = new Image()
    image.src = url
    image.onload = function () {
      resolve(image)
    }
  })
}
