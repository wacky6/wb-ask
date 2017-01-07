<template>
  <div class="charge-wealth flex-horz">
    <el-button
      type="success"
      :loading="loading"
      size="large"
      @click="okCharge(100)"
    > 100点财富 </el-button>
  </div>
</template>

<script>
import {token} from './global-states'
export default {
  data: ()=>({
    loading: false
  }),
  computed: { token },
  methods: {
    async okCharge(num) {
      this.loading = true
      try{
        let {
          status = 0,
          body: { wealth, error }
        } = await this.$agent.post('/api/okCharge')
                  .send({ jwt: this.token, amount: num })
        if (status === 200) {
          this.$store.commit('updateWealth', wealth)
          this.$notify({
            type: 'success',
            title: '充值成功',
            message: '当前财富点数为 '+wealth
          })
        }
      } catch(e) {
        console.log(e)
        this.$notify({
          type: 'error',
          title: '充值失败',
          message: '请稍后再试'
        })
      }
      this.loading = false
    }
  }
}
</script>

<style lang="stylus">
@import "styles/flex-horz";
.charge-wealth
  align-items: center
  justify-content: center
</style>
