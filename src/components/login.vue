<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/img.jpg" alt="">
            </div>
            <el-form ref="loginformref" class="login_form" :model="loginform" :rules="loginformrules">
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名" prefix-icon="iconfont icon-user" v-model="loginform.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" prefix-icon="iconfont icon-passwd" v-model="loginform.password" show-password></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button type="info" @click="resetloginform">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginform: {
        username: '',
        password: ''
      },
      loginformrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetloginform () {
    //   console.log(this)
      this.$refs.loginformref.resetFields()
    },
    login () {
      this.$refs.loginformref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginform)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        else this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$store.dispatch('saveUser', res.data.username)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
    // background-color: #2b4b6b;
    background-image: url(../assets/login-bg.jpg);
    background-size: 100%;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    // opacity: 50%;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 10px #ddd;
}
.avatar_box{
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>
