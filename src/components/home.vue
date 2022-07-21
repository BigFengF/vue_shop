<template>
    <el-container>
        <el-header>
            <div>
              <div class="collapse-btn" @click="togglecollapse">
                <i v-if="!iscollapse " class="el-icon-s-fold"></i>
                <i v-else class="el-icon-s-unfold"></i>
            </div>
              <!-- <div class="togglebutton" @click="togglecollapse">|||</div> -->
                <!-- <img src="../assets/butty.jpg" alt=""> -->
                <span class="houtai">电商后台管理系统</span>
            </div>
            <div class="header-right">
            <div class="header-user-con">
            <div class="user-avator">
                    <img src="../assets/img.jpg" />
            </div>
            <!-- <div> -->
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  {{userInfos}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="open">项目仓库</el-dropdown-item>
                  <el-dropdown-item @click.native="personCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            </div>
        </el-header>
    <el-container>
    <el-aside :width="iscollapse ? '65px' : '200px' ">
      <!-- <div class="togglebutton" @click="togglecollapse">|||</div> -->
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"  unique-opened :collapse="iscollapse" :collapse-transition='false' router
      :default-active="activepath">
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState('/' + subitem.path)">
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
            </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-shangpinguanli',
        101: 'iconfont icon-quanxianguanli',
        102: 'iconfont icon-shujutongji',
        145: 'iconfont icon-dingdanguanli'
      },
      iscollapse: false,
      activepath: ''
    }
  },
  created () {
    this.getmenulist()
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  computed: {
    ...mapState({
      userInfos: (state) => state.userInfo
    })
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      window.localStorage.clear()
      this.$router.push('/login')
    },
    async getmenulist () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.status)
      this.menulist = res.data
      console.log(this.menulist)
      console.log('222', this.userInfos)
    },
    togglecollapse () {
      this.iscollapse = !this.iscollapse
    },
    // 保存链接的激活状态
    saveNavState (activepath) {
      window.sessionStorage.setItem('activepath', activepath)
    },
    personCenter () {
      this.$router.push('/welcome')
    },
    open () {
      window.open('http://10.0.99.33/dashboard/projects?nav_source=navbar')
    }
  }
}
</script>
<style lang="less" scoped>
.el-container{
    height: 100%;
}
.user-avator {
    margin-left: 10px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 60px;
    align-items: center;
}
.user-name {
    margin-left: 10px;
    color: #fff
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.collapse-btn {
    float: left;
    color: #fff;
    padding: 0 30px;
    cursor: pointer;
    line-height: 70px;
}
.el-header{
    display: flex;
    // height: 70px;
    justify-content: space-between;
    margin: 0px;
    padding: 0px;
    background-color: #373d41;
    img{
        height: 60px;
        width: 60px;
    }
    .houtai{
        position: absolute;
        top: 20px;
        left: 60px;
        font-size: 20px;
        color: #fff;
    }
    span{
      color: #fff;
    }
}
.el-aside{
    background-color: #333744;
}
.el-main{
    background-color: #fff;
}
.iconfont{
  margin-right: 15px;
  font-size: 20px;
}
.el-menu{
  border: 0px;
}
.togglebutton{
  background-color: #4a5064;
  color: #fff;
  height: 30px;
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>
