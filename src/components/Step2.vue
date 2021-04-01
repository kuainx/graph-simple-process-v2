<template>
  <el-row>
    <el-col :span="6"><img class="thumb" :src="template.thumb" alt=""></el-col>
    <el-col :span="18">
      <div class="user-block" v-for="(item ,index) in userFilter" :key="index">
        <span>{{ item.name }}</span>
        <el-upload :auto-upload="false" drag action="" :multiple="false" :show-file-list="false" :onChange="onFileSelected(item._key)">
          <i class="el-icon-picture"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>
          <template #tip>
            <div class="el-upload__tip">
              请导入图片文件
              <el-button v-if="item.data" type="success" size="mini" icon="el-icon-check" circle></el-button>
            </div>
          </template>
        </el-upload>
      </div>
    </el-col>
  </el-row>
  <el-button style="margin: 20px;" type="primary" round @click="confirmUserConfig">下一步</el-button>
  <el-dialog title="提示" v-model="dialogVisible" width="30%">
    <div>确认选择该图片吗？</div>
    <img class="userImg" :src="userImage" alt="">
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElNotification } from 'element-plus'
import { Blob2DataUrl } from '@/utils/blob'

export default {
  name: 'Step2',
  props: ['template'],
  emits: ['next'],
  setup (props, { emit }) {
    const state = reactive({
      template: props.template,
      userFilter: [],
      userImage: '',
      dialogVisible: false,
      confirmImage: null
    })
    for (const key in state.template.layer) {
      const item = state.template.layer[key]
      if (item.type === 'userImage') {
        item._key = key
        state.userFilter.push(item)
      }
    }
    const confirmUserConfig = () => {
      for (const key in state.userFilter) {
        if (!state.userFilter[key].data) {
          ElNotification.error({
            title: '错误',
            message: state.userFilter[key].name + '未完成'
          })
          return
        }
      }
      emit('next', state.template)
    }
    const onFileSelected = index => {
      return function (file) {
        inputFile(index, file)
      }
    }
    const inputFile = async (index, file) => {
      console.log(index, file)
      state.userImage = await Blob2DataUrl(file.raw)
      state.confirmImage = () => {
        state.template.layer[index].data = state.userImage
        state.dialogVisible = false
      }
      state.dialogVisible = true
    }
    return {
      onFileSelected,
      confirmUserConfig,
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.thumb {
  width: 100%;
}

.el-icon-picture {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}

.user-block {
  margin: 0 30px;
  padding: 5px;
  border: 2px #888 dashed;
  border-radius: 10px;
}

.userImg {
  max-width: 100%;
  max-height: 200px;
}
</style>
