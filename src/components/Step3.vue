<template>
  <div class="download-btn">
    <el-button type="success" round v-if="img" @click="downloadImg">下载<i class="el-icon-download el-icon--right"></i>
    </el-button>
  </div>
  <div class="render-container">
    <h3 v-if="status">{{ status }}</h3>
    <img :src="img" alt="" class="render">
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElNotification } from 'element-plus'
import { getBlob } from '@/utils/ajax'
import { Blob2DataUrl } from '@/utils/blob'

export default {
  name: 'Step3',
  props: ['template'],
  setup (props) {
    const state = reactive({
      status: '拉取预定义资源',
      template: props.template,
      img: ''
    })
    const getImageDOM = async (url) => {
      return new Promise(function (resolve) {
        const image = new Image()
        image.src = url
        image.onload = function () {
          resolve(image)
        }
      })
    }
    const startUp = async () => {
      const template = state.template
      for (const key in template.layer) {
        const item = template.layer[key]
        if (item.type === 'staticImage' || item.type === 'userImage') {
          if (!item.data) {
            try {
              const blob = await getBlob(item.url)
              item.data = await Blob2DataUrl(blob)
            } catch (e) {
              ElNotification.error({
                title: '错误',
                message: item.name + '资源加载失败，错误信息：' + e
              })
              console.log(e)
              return
            }
          }
          item.raw = await getImageDOM(item.data)
        }
      }
      state.status = '生成图像'
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
      state.status = ''
      state.img = canvas.toDataURL()
    }
    startUp()
    const downloadImg = () => {
      const saveLink = document.createElement('a')
      saveLink.href = state.img
      saveLink.download = 'download.png'
      saveLink.click()
    }
    return {
      downloadImg,
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.render {
  max-width: 100%;
  max-height: 50%;
}

.download-btn {
  padding: 20px;
}
</style>
