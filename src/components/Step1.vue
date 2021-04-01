<template>
  <el-upload :auto-upload="false" drag :multiple="false" action="" accept=".template" :show-file-list="false" :onChange="onFileSelected">
    <i class="el-icon-set-up"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>
    <template #tip>
      <div class="el-upload__tip">
        请导入模板文件（.template）
      </div>
    </template>
  </el-upload>
  <el-dialog title="提示" v-model="dialogVisible" width="30%">
    <div>确认选择该模板吗？</div>
    <img class="thumb" :src="thumb" alt="" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTemplate" :loading="confirmLoading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElNotification } from 'element-plus'
import { initTemplateFile, resolveTemplate } from '@/utils/template'

export default {
  name: 'Step1',
  emits: ['next'],
  setup: function (props, { emit }) {
    const vdata = {}
    const state = reactive({
      dialogVisible: false,
      thumb: '',
      confirmLoading: false
    })
    const onFileSelected = async file => {
      const data = await initTemplateFile(file.raw)
      if (data.err) {
        ElNotification.error({
          title: '错误',
          message: data.err
        })
      } else {
        vdata.temlpate = data
        state.thumb = data.thumb
        state.dialogVisible = true
      }
    }
    const confirmTemplate = async () => {
      state.confirmLoading = true
      ElNotification({
        title: '提示',
        message: '正在拉取模板，请稍后',
        type: 'success'
      })
      try {
        vdata.data = await resolveTemplate(vdata.temlpate)
        emit('next', vdata.data)
      } catch (e) {
        ElNotification.error({
          title: '错误',
          message: e
        })
      }
      state.dialogVisible = false
    }
    return {
      onFileSelected,
      confirmTemplate,
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.el-icon-set-up {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}

.thumb {
  max-height: 200px;
  max-width: 100%;
}
</style>
