<template>
  <el-row>
    <el-col :span="12"><img class="thumb" :src="thumb" alt="" /></el-col>
    <el-col :span="12">
      <el-input placeholder="请输入网络图片地址" v-model="url" class="input">
        <template #append>
          <el-button :loading="loading" @click="getFile">拉取<i class="el-icon-download el-icon--right"></i></el-button>
        </template>
      </el-input>
      <el-upload :auto-upload="false" drag action="" :multiple="false" :show-file-list="false" :onChange="onFileSelect">
        <i class="el-icon-picture"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击选择文件</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请导入图片文件或输入网络图片链接
          </div>
        </template>
      </el-upload>
    </el-col>
  </el-row>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { getBlob } from '@/utils/ajax'
import { Blob2DataUrl } from '@/utils/blob'
import { ElNotification } from 'element-plus'

export default {
  name: 'Selector1',
  emits: ['select'],
  setup (props, { emit }) {
    const state = reactive({
      thumb: 'https://cdn.jsdelivr.net/gh/kuainx/cdn@master/wallpaper/Tomori_Nao/2.jpg',
      url: '',
      loading: false
    })
    const onFileSelect = async e => {
      state.thumb = await Blob2DataUrl(e.raw)
      emit('select', state.thumb)
    }
    const getFile = async () => {
      state.loading = true
      try {
        const blob = await getBlob(state.url)
        state.thumb = await Blob2DataUrl(blob)
        emit('select', state.thumb)
      } catch (e) {
        ElNotification.error({
          title: '错误，图片拉取失败',
          message: e
        })
      }
      state.loading = false
    }
    return {
      getFile,
      onFileSelect,
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.input {
  padding: 10px;
  width: 360px;
}

.thumb {
  width: 100%;
}

.el-icon-picture {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}
</style>
