<template>
  <el-dialog title="选择图片" v-model="showModal" :before-close="onCancel" style="width:80%">
    <div>
      <el-steps :active="current" align-center>
        <el-step title="选择"></el-step>
        <el-step title="裁剪"></el-step>
        <el-step title="确认"></el-step>
      </el-steps>
      <div>
        <Selector1 v-show="current===0" @select="onSelect" />
        <Selector2 v-show="current===1" @cropped="onCrop" :img="cropImg" :layer="layer" :get="cropGet" />
        <div v-show="current===2">
          <img :src="img" alt="" class="thumb">
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button-group>
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="previous" icon="el-icon-arrow-left">上一步</el-button>
          <el-button type="primary" @click="next">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import Selector1 from './SelectorStep/Selector1'
import Selector2 from './SelectorStep/Selector2'
import { ElNotification } from 'element-plus'

export default {
  name: 'ImageSelector',
  props: ['layerDat'],
  emits: ['success', 'cancel'],
  components: { Selector1, Selector2 },
  setup (props, { emit }) {
    const state = reactive({
      showModal: true,
      layer: props.layerDat,
      current: 0,
      img: '',
      cropImg: '',
      cropGet: 0
    })
    const previous = () => {
      if (state.current !== 0) {
        state.current--
      }
    }
    const next = () => {
      switch (state.current) {
        case 0:
          if (!state.img) {
            ElNotification.error({
              title: '错误',
              message: '请先选择图片'
            })
          } else {
            state.cropImg = state.img
            state.current++
          }
          break

        case 1:
          state.cropGet++
          break

        case 2:
          emit('success', state.img)
          onCancel()
          break

        default:
          ElNotification.error({
            title: '错误',
            message: '未知错误(503)'
          })
          break
      }
    }
    const onCancel = () => {
      state.showModal = false
      setTimeout(() => {
        emit('cancel')
      }, 400)
    }
    const onSelect = e => {
      state.img = e
    }
    const onCrop = e => {
      state.img = e
      state.current++
    }
    return {
      onCancel,
      previous,
      next,
      onSelect,
      onCrop,
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.thumb {
  max-width: 100%;
  max-height: max(100%, 500px);
}
</style>
