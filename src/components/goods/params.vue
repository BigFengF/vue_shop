<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
          <el-alert
          title="注意: 只允许第三级分类设置的相关参数"
          type="warning"
          :closable="false"
          show-icon>
          </el-alert>
          <el-row class="params-row">
            <el-col>
              <span>选择商品类型</span>
              <el-cascader
                expandTrigger="hover"
                v-model="selectcatekeys"
                :options="paramslist"
                :props="cateprops"
                @change="handleChange"
                clearable>
              </el-cascader>
            </el-col>
          </el-row>
          <el-tabs v-model="activeName">
            <el-tab-pane label="动态参数" name="many">
              <el-button type="primary" :disabled="isbtndisabled" @click="addparamsdialogVisible = true">添加参数</el-button>
              <el-table :data="manytabledata">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                      {{item}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column label="参数名称" prop="attr_name">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="editparamsdialogmethod(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteparamsdialogmethod(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" :disabled="isbtndisabled" @click="addparamsdialogVisible = true">添加属性</el-button>
              <el-table :data="onlytabledata" >
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                      {{item}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="editparamsdialogmethod(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteparamsdialogmethod(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-dialog
          :title="changetext"
          :visible.sync="addparamsdialogVisible"
          width="30%" @close="addparamsdialogclosed">
          <el-form ref="addparamsdialogform" :model="addparamsdialogform" label-width="80px">
            <el-form-item :label="changetexttwo">
              <el-input v-model="addparamsdialogform.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addparamsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addparamsdialogmakesure">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :title="changetextthree"
          :visible.sync="editparamsdialogVisible"
          width="30%" @closed="editparamsdialogclosed">
          <el-form ref="addparamsdialogform" :model="editparamsdialogform" label-width="80px"  :rules="editparamsdialogrules">
            <!-- prop中的字段一定要和input里面字段一样 -->
            <el-form-item :label="changetexttwo" prop="attr_name">
              <el-input v-model="editparamsdialogform.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="editparamsdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editparamsdialogmakesure">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      paramslist: [],
      // 级联选择框的配置对象
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框的双向绑定的数组
      selectcatekeys: [],
      activeName: 'many',
      manytabledata: [],
      onlytabledata: [],
      addparamsdialogVisible: false,
      id: '',
      addparamsdialogform: {
        attr_name: ''
      },
      editparamsdialogVisible: false,
      editparamsdialogform: {
        attr_name: ''
      },
      editparamsdialogrules: {
        attr_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getparamslist()
  },
  computed: {
    isbtndisabled () {
      if (this.selectcatekeys.length !== 3) return true
      return false
    },
    cateid () {
      if (this.selectcatekeys.length === 3) {
        return this.selectcatekeys[2]
      } else return null
    },
    changetext () {
      if (this.activeName === 'many') return '添加动态参数'
      else return '添加静态属性'
    },
    changetexttwo () {
      if (this.activeName === 'many') return '动态参数'
      else return '静态属性'
    },
    changetextthree () {
      if (this.activeName === 'many') return '编辑动态参数'
      else return '编辑静态属性'
    }
  },
  methods: {
    async getparamslist () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.message.error('获取商品列表失败')
      this.paramslist = res.data
      console.log(this.paramslist)
    },
    async handleChange () {
      if (this.selectcatekeys.length !== 3) {
        this.manytabledata = []
        this.onlytabledata = []
        this.selectcatekeys = []
        return false
      }
      // console.log(this.cateid)
      // console.log(this.activeName)
      const { data: res } = await this.$http.get(`categories/${this.cateid}/attributes`, { params: { sel: this.activeName } })
      const result = await this.$http.get(`categories/${this.cateid}/attributes`, { params: { sel: 'only' } })
      this.onlytabledata = result.data.data
      console.log(result)
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      // console.log(res.data)
      // console.log(this.selectcatekeys)
      if (this.activeName === 'many') {
        this.manytabledata = res.data
        // console.log(this.manytabledata)
      } else {
        this.onlytabledata = res.data
        // console.log(this.onlytabledata)
      }
    },
    handletabClick () {
      this.handleChange()
      // console.log(this.activeName)
    },
    addparamsdialogclosed () {
      this.addparamsdialogform.attr_name = ''
    },
    async addparamsdialogmakesure () {
      const { data: res } = await this.$http.post(`categories/${this.cateid}/attributes`, { attr_name: this.addparamsdialogform.attr_name, attr_sel: this.activeName })
      // console.log(res)
      if (res.meta.status !== 201) return this.$message.error('添加属性失败')
      this.handleChange()
      this.addparamsdialogVisible = false
      this.$message.success('添加属性成功')
    },
    editparamsdialogclosed () {
      this.$refs.addparamsdialogform.resetFields()
    },
    async editparamsdialogmakesure () {
      const { data: res } = await this.$http.put(`categories/${this.cateid}/attributes/${this.id}`, { attr_name: this.editparamsdialogform.attr_name, attr_sel: this.activeName })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('修改列表失败')
      this.editparamsdialogVisible = false
      this.handleChange()
      this.$message.success('修改列表成功')
    },
    async editparamsdialogmethod (attrid) {
      this.id = attrid
      // console.log(attrid)
      this.editparamsdialogVisible = true
      // console.log(this.selectcatekeys)
      const { data: res } = await this.$http.get(`categories/${this.cateid}/attributes/${attrid}`, { attr_sel: this.activeName })
      // console.log(res.data)
      this.editparamsdialogform.attr_name = res.data.attr_name
    },
    async deleteparamsdialogmethod (attrid) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      if (result === 'cancel') return this.$message.info('您已取消了删除')
      const { data: res } = await this.$http.delete(`categories/${this.cateid}/attributes/${attrid}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.handleChange()
      this.$message.success('删除成功')
    },
    showInput (row) {
      row.inputVisible = true
      // $nextTick当页面从新渲染后重新调用回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveattrvals(row)
    },
    async saveattrvals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('添加新参数名称失败')
      else return this.$message.success('添加新参数名称成功')
    },
    handleClose (i, row) {
      console.log(row.attr_vals)
      // 删除从i后面的一项
      row.attr_vals.splice(i, 1)
      console.log(row.attr_vals)
      this.saveattrvals(row)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  margin-top: 20px
}
.params-row{
  margin: 20px 0px 20px
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 150px;
}
</style>
