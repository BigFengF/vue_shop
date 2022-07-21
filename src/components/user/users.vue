<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
            <el-card class="box-card">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div style="margin-top: 15px;">
                            <el-input placeholder="请输入内容" class="input-with-select" v-model="queryinfo.query" clearable @clear="getuserlist">
                            <el-button slot="append" icon="el-icon-search" @click="finduserlist"></el-button>
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" class="userbutton" @click="dialogVisible = true">添加用户</el-button>
                    </el-col>
                </el-row>
                <el-table
                :data="userlist"
                style="width: 100%"
                stripe>
                <el-table-column
                        type="index"
                        label="#">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户名">
                    </el-table-column>
                    <el-table-column
                        prop="role_name"
                        label="角色名称">
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="电话">
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="电子邮箱">
                    </el-table-column>
                    <el-table-column
                        prop="create_time"
                        label="创建时间">
                    </el-table-column>
                    <el-table-column
                        label="状态">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.mg_state"
                                @change="userstatechanged(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作" width="180px" class="table-button">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="small" @click="showeditdialog(scope.row.id)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeuserbyid(scope.row.id)"></el-button>
                            <el-tooltip effect="dark" content="分配角色" placement="bottom" enterable:false>
                                <el-button type="warning" icon="el-icon-setting" size="small" @click="setroles(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    </el-table>
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryinfo.pagenum"
                    :page-sizes="[1, 2, 3, 4]"
                    :page-size="queryinfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="this.total">
                    </el-pagination>
            </el-card>
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%" @close="adddialogclosed">
                <el-form :model="addform" :rules="addformrules" ref="addformref" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addform.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addform.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addform.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addform.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="adduser">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
              title="修改用户信息"
              :visible.sync="editdialogVisible"
              width="50%" @closed="editdialogclosed">
              <el-form ref="editformref" label-width="80px" :model="editform" :rules="editformrules">
                <el-form-item label="用户名">
                  <el-input v-model="editform.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editform.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="editform.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
              <el-button @click="editdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="edituserinfo">确 定</el-button>
  </span>
            </el-dialog>
            <el-dialog
              title="分配角色"
              :visible.sync="setrolesdialogvisible"
               width="50%" @close="setroledialogclose">
              <div>
                <p>当前的用户:  {{userinfo.username}}<p>
                <p>当前的角色:  {{userinfo.role_name}}</p>
                <p>分配新角色:
                  <el-select v-model="selectedroleid" placeholder="请选择">
                      <el-option
                        v-for="item in roleslist"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                      </el-option>
                  </el-select></p>
              </div>
              <span slot="footer" class="dialog-footer">
              <el-button @click="setrolesdialogvisible = false">取 消</el-button>
               <el-button type="primary" @click="saveroleinfo">确 定</el-button>
              </span>
            </el-dialog>
    </div>
</template>
<script>
import { newDate } from '../../data'
export default {
  data () {
    var checkemail = (rule, value, cb) => {
      const regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9])+(\.[a-zA-Z0-9])+/
      if (regemail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkmobile = (rule, value, cb) => {
      const regmobile = /^(13[0-9]|14[56789]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[13589])[0-9]{8}$/
      if (regmobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addformrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '输入的用户名在三到十位之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '输入到密码在三到十五之间', triggee: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      editformrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      editform: {},
      userlist: [],
      total: 0,
      dialogVisible: false,
      editdialogVisible: false,
      userinfo: {},
      setrolesdialogvisible: false,
      roleslist: [],
      selectedroleid: ''
    }
  },
  created () {
    this.getuserlist()
  },
  methods: {
    async getuserlist () {
      // this.queryinfo.pagenum = 1
      const { data: res } = await this.$http.get('users', { params: this.queryinfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.status)
      this.userlist = res.data.users
      // eslint-disable-next-line no-const-assign
      for (var i = 0; i < this.userlist.length; i++) {
        const newdate = newDate(this.userlist[i].create_time)
        this.userlist[i].create_time = newdate
      }
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
    //   console.log(newsize)
      this.queryinfo.pagesize = newsize
      this.getuserlist()
    },
    handleCurrentChange (newpage) {
    //   console.log(newpage)
      this.queryinfo.pagenum = newpage
      this.getuserlist()
    },
    async userstatechanged (userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      //   console.log(res)
      if (res.meta.status !== 200) {
        userinfo.data.mg_state = !userinfo.data.mg_state
        return this.$message.error('修改状态失败')
      }
      return this.$message.success('修改状态成功')
    },
    // 重置表单项
    adddialogclosed () {
      // 重置表单
      this.$refs.addformref.resetFields()
    },
    adduser () {
      this.$refs.addformref.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('users', this.addform)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户名失败')
        this.$message.success('添加用户名成功')
        this.dialogVisible = false
        this.getuserlist()
      })
    },
    async showeditdialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('编辑用户信息失败')
      this.editform = res.data
      // console.log(this.editform)
      this.editdialogVisible = true
    },
    editdialogclosed () {
      this.$refs.editformref.resetFields()
    },
    edituserinfo () {
      this.$refs.editformref.validate(async valid => {
        // console.log(valid)
        if (!valid) return false
        const { data: res } = await this.$http.put('users/' + this.editform.id, {
          email: this.editform.email,
          mobile: this.editform.mobile
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.editdialogVisible = false
        this.getuserlist()
        this.$message.success('更新用户信息列表成功')
      })
    },
    async removeuserbyid (id) {
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') return this.$message.info('已取消删除')
      const { data: resdelete } = await this.$http.delete('users/' + id)
      console.log(resdelete)
      this.getuserlist()
      if (resdelete.meta.status !== 200) {
        return this.$message.error('删除失败')
      } else return this.$message.success('删除成功')
    },
    async setroles (userinfo) {
      this.userinfo = userinfo
      // console.log(this.userinfo)
      const { data: res } = await this.$http.get('roles')
      this.roleslist = res.data
      console.log(this.roleslist)
      if (res.meta.status !== 200) return this.message.error('获取角色列表失败')
      this.setrolesdialogvisible = true
    },
    async saveroleinfo () {
      if (!this.selectedroleid) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, {
        rid: this.selectedroleid
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色列表失败')
      }
      this.setrolesdialogvisible = false
      this.getuserlist()
    },
    setroledialogclose () {
      this.selectedroleid = ''
      this.userinfo = {}
    },
    finduserlist () {
      this.queryinfo.pagenum = 1
      this.getuserlist()
    }
  }
}

</script>
<style lang="less" scoped>
    .box-card{
        margin-top: 30px;
    }
    .userbutton{
        margin-top: 15px;
    }
    .el-table--fit{
        margin-top: 15px;
    }
    .el-table .cell{
        display: flex !important;
    }
</style>
