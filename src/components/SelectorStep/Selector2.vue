<template>
  <div>
    <img :src="imgSrc" alt="" ref="imgDom" class="cropper">
  </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'Selector1',
  props: ['img', 'layer', 'get'],
  emits: ['cropped'],
  setup (props, { emit }) {
    let cropper = null
    const state = reactive({
      imgDom: null,
      imgSrc: '',
      layer: props.layer
    })
    watch(() => props.img, () => {
      if (cropper) {
        cropper.replace(props.img)
      } else {
        state.imgSrc = props.img
        state.imgDom.onload = () => {
          cropper = new Cropper(state.imgDom, {
            aspectRatio: state.layer.width / state.layer.height,
            dragMode: 'move',
            viewMode: 1
          })
        }
      }
    })
    watch(() => props.get, () => {
      emit('cropped', cropper.getCroppedCanvas().toDataURL())
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.cropper {
  display: block;
  max-width: 100%;
}
</style>
