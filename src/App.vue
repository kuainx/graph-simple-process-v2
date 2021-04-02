<template>
  <div class="container">
    <el-steps :active="currentStep" align-center>
      <el-step title="添加模板"></el-step>
      <el-step title="上传资源"></el-step>
      <el-step title="文件导出"></el-step>
    </el-steps>
    <div class="content">
      <Step1 v-if="currentStep===0" @next="step1N"></Step1>
      <Step2 v-if="currentStep===1" @next="step2N" :template="template"></Step2>
      <Step3 v-if="currentStep===2" :template="template"></Step3>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import Step1 from '@/components/Step1'
import Step2 from '@/components/Step2'
import Step3 from '@/components/Step3'

export default {
  name: 'App',
  components: {
    Step1, Step2, Step3
  },
  setup () {
    const state = reactive({
      currentStep: 0,
      template: null
    })
    const step1N = e => {
      state.currentStep = 1
      state.template = e
    }
    const step2N = e => {
      state.currentStep = 2
      state.template = e
    }
    return {
      step1N,
      step2N,
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.container {
  margin: max(100px, 10%);
}

.content {
  margin: 20px;
  text-align: center;
}
</style>
