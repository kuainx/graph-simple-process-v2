<template>
  <div class="download-btn">
    <el-button type="success" round @click="downloadImg">下载<i class="el-icon-download el-icon--right"></i>
    </el-button>
  </div>
  <div class="render-container">
    <img :src="img" alt="" class="render">
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { renderOutputImage } from '@/utils/render'

export default {
  name: 'Step3',
  props: ['template'],
  setup (props) {
    const state = reactive({
      img: ''
    })
    setTimeout(() => {
      state.img = renderOutputImage(props.template)
    })
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
