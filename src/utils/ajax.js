export const getBlob = async url => {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.open('GET', url, true)
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(new Error(xhr.statusText))
      }
    }
    xhr.onerror = function () {
      reject(new Error(xhr.statusText))
    }
    xhr.send()
  })
}
