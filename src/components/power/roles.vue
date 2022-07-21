<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="rolescard">
            <el-row>
            <el-col>
                <el-button type="primary" class="userbutton" @click="addrolesVisible = true">添加用户</el-button>
            </el-col>
            </el-row>
            <el-table
            :data="roleslist"
            style="width: 100%"
            stripe
            class="rolestable">
                <el-table-column
                     type="expand">
                     <template slot-scope="scope">
                         <!-- <pre>{{scope.row}}</pre> -->
                         <el-row :class="['bd-bottom', i1 === 0 ? 'bd-top' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                             <el-col :span="5">
                                 <el-tag closable @close="removerightsbyid(scope.row, item1.id)">{{item1.authName}}</el-tag>
                                 <i class="el-icon-caret-right"></i>
                             </el-col>
                             <el-col :span="19">
                                 <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bd-bottom', 'vcenter']">
                                     <el-col :span="8">
                                         <el-tag type="success" closable @close="removerightsbyid(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                         <i class="el-icon-caret-right"></i>
                                     </el-col>
                                     <el-col :span="16">
                                         <el-row v-for="(item3) in item2.children" :key="item3.id">
                                             <el-col :span="24">
                                                 <el-tag type="warning" closable @close="removerightsbyid(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                             </el-col>
                                         </el-row>
                                     </el-col>
                                 </el-row>
                             </el-col>
                         </el-row>
                     </template>
                </el-table-column>
                <el-table-column
                    type="index"
                    label="#">
                </el-table-column>
                <el-table-column
                    prop="roleName"
                    label="角色名称">
                </el-table-column>
                <el-table-column
                    prop="roleDesc"
                    label="角色描述">
                </el-table-column>
                <el-table-column
                    label="操作" width="300px" class="table-button">
                    <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editrolesmessage(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleterolesmessage(scope.row)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showsetrightdialog(scope.row)">权限分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
            title="添加角色列表"
            :visible.sync="addrolesVisible"
             width="50%">
        <el-form ref="addrolesform" :model="addroleslist" label-width="80px">
            <el-form-item label="角色名称">
                 <el-input v-model="addroleslist.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                 <el-input v-model="addroleslist.roleDesc"></el-input>
            </el-form-item>
        </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addrolesVisible = false">取 消</el-button>
            <el-button type="primary" @click="addroles">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="setrightdialogvisible"
            width="30%"
            @close="setrightdialogclosed">
            <el-tree :data="rightslist" :props="roleprops" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeref"></el-tree>
            <span slot="footer" class="dialog-footer">
            <el-button @click="setrightdialogvisible = false">取 消</el-button>
            <el-button type="primary" @click="allotrights">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改权限信息"
             :visible.sync="editrolesVisible"
            width="50%">
            <el-form ref="editrolesform" :model="rolesmodel" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="rolesmodel.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="rolesmodel.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editrolesVisible = false">取 消</el-button>
             <el-button type="primary" @click="editrolesbutton">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      roleslist: [],
      rolesVisible: false,
      setrightdialogvisible: false,
      rightslist: [],
      defkeys: [],
      roleid: '',
      editrolesVisible: false,
      addrolesVisible: false,
      rolesmodel: {},
      roleobj: {},
      roleprops: {
        label: 'authName',
        children: 'children'
      },
      addroleslist: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  created () {
    this.getlistroles()
  },
  methods: {
    async getlistroles () {
      const { data: res } = await this.$http.get('roles')
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.roleslist = res.data
    },
    async removerightsbyid (role, rightid) {
      const confirmresult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   console.log(confirmresult)
      if (confirmresult === 'cancel') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      //   this.getlistroles()
      role.children = res.data
      return this.$message.success('删除成功')
    },
    async showsetrightdialog (roles) {
      this.roleid = roles.id
      this.setrightdialogvisible = true
      const { data: res } = await this.$http.get('rights/tree')
      //   console.log(res)
      if (res.meta.status !== 200) return this.message.error('获取权限列表失败')
      this.rightslist = res.data
      //   console.log(this.rightslist)
      this.getleafkeys(roles, this.defkeys)
    },
    getleafkeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getleafkeys(item, arr))
    },
    setrightdialogclosed () {
      this.defkeys = []
    },
    async allotrights () {
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys()
      ]
      //   console.log(keys)
      const idstr = keys.join(',')
      //   console.log(idstr)
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, { rids: idstr })
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error('权限分配成功')
      this.getlistroles()
      this.setrightdialogvisible = false
      this.$message.success('权限分配成功')
    },
    async editrolesmessage (message) {
      this.roleobj = message
      //   console.log(message)
      const { data: res } = await this.$http.put(`roles/${message.id}`, { roleName: message.roleName, roleDesc: message.roleDesc })
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.message.error('获取权限列表失败')
      }
      this.rolesmodel = res.data
      this.editrolesVisible = true
    },
    async editrolesbutton () {
      const { data: res } = await this.$http.put(`roles/${this.roleobj.id}`, { roleName: this.rolesmodel.roleName, roleDesc: this.rolesmodel.roleDesc })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.message.error('更新权限列表失败')
      }
      this.getlistroles()
      this.editrolesVisible = false
    },
    async addroles () {
      const { data: res } = await this.$http.post('roles', { roleName: this.addroleslist.roleName, roleDesc: this.addroleslist.roleDesc })
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.getlistroles()
      this.addrolesVisible = false
      this.addroleslist = {}
    },
    async deleterolesmessage (scope) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   console.log(confirm)
      const { data: res } = await this.$http.delete('roles/' + scope.id)
      console.log(res)
      if (confirm === 'cancel') {
        return this.$message.info('您已取消了删除')
      }
      this.getlistroles()
      return this.$message.success('删除成功')
    }
  }
}
</script>
<style lang="less" scoped>
.rolescard{
    margin-top: 30px;
}
.el-tag{
    margin: 7px;
}
.bd-top{
    border-top: 1px solid #eee
}
.bd-bottom{
    border-top: 1px solid #eee
}
.vcenter{
    display: flex;
    align-items: center
}
</style>
