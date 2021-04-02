<template>
  <div>
    <el-button type="primary" @click="confirmUserConfig" round class="next-btn">完成</el-button>
  </div>
  <div>
    <img :src="preview" alt="" class="preview" @click="imageClickHandler" />
  </div>
  <ImageSelector v-if="dialogVisible" :layerDat="layerDat" @cancel="dialogVisible=false" @success="selectorHandler" />
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElNotification } from 'element-plus'
import { getImageDOM } from '@/utils/blob'
import { getPreview } from '@/utils/render'
import ImageSelector from './ImageSelector'
import { getClickLayer } from '@/utils/template'

export default {
  name: 'Step2',
  props: ['template'],
  emits: ['next'],
  components: { ImageSelector },
  setup (props, { emit }) {
    const state = reactive({
      template: props.template,
      preview: 'https://cdn.jsdelivr.net/gh/kuainx/cdn@master/wallpaper/Tomori_Nao/1.jpg',
      userImage: '',
      dialogVisible: false,
      confirmImage: null,
      layerDat: null
    })
    const reloadPreview = async () => {
      ElNotification({
        title: '提示',
        message: '正在生成预览',
        type: 'success'
      })
      state.preview = await getPreview(state.template)
    }
    setTimeout(reloadPreview)
    const confirmUserConfig = () => {
      emit('next', state.template)
    }
    const imageClickHandler = e => {
      const x = e.offsetX / e.target.offsetWidth * state.template.width
      const y = e.offsetY / e.target.offsetHeight * state.template.height
      const layerId = getClickLayer(state.template.imageArea, x, y)
      if (layerId !== -1) {
        state.layerDat = state.template.layer[layerId]
        state.dialogVisible = true
      }
    }
    const selectorHandler = async e => {
      state.layerDat.placeholder = false
      state.layerDat.img = await getImageDOM(e)
      reloadPreview()
    }
    return {
      selectorHandler,
      imageClickHandler,
      confirmUserConfig,
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.preview {
  width: 100%;
  border: #66ccff 2px dashed;
}

.next-btn {
  margin: 20px;
}
</style>
