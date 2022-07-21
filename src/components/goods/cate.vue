<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" class="userbutton" @click="addcate">添加分类</el-button>
                </el-col>
            </el-row>
            <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" class="tree-table">
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-if="scope.row.cat_level===1" type="success">二级</el-tag>
                    <el-tag v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="editcatedialog(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="detelecatedialog(scope.row)">删除</el-button>
                </template>
            </tree-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="params.pagnum"
              :page-sizes="[1, 3, 5, 7]"
              :page-size="params.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
          title="添加分类"
          :visible.sync="addcateVisible"
          width="50%"
          @close="addcatedialogclosed">
          <el-form ref="addcateformref" :model="addcateform" label-width="100px" :rules="addcaterules">
            <el-form-item label="分类名称:" prop="cat_name">
              <el-input v-model="addcateform.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类:">
              <el-cascader
                expandTrigger="hover"
                v-model="selectkeys"
                :options="addcatelist"
                :props="cascaderprops"
                @change="parantcatechange"
                clearable
                change-on-select></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addcateVisible = false">取 消</el-button>
          <el-button type="primary" @click="addcatemethod">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="修改分类"
          :visible.sync="editcatedialogVisible"
          width="50%">
          <el-form ref="editcateformref" label-width="80px" :model="editcatedialogform">
          <el-form-item label="分类名称">
            <el-input v-model="editcatedialogform.cat_name"></el-input>
          </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="editcatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editcatedialogmakesure">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
  data () {
    return {
      params: {
        typen: 3,
        pagenum: 1,
        pagesize: 5
      },
      cascaderprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectkeys: [],
      total: 0,
      catelist: [],
      addcateVisible: false,
      addcatelist: [],
      editcatedialogVisible: false,
      editcatedialogform: '',
      addcateform: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addcaterules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getcatelist()
  },
  methods: {
    async getcatelist () {
      const { data: res } = await this.$http.get('categories', { params: this.params })
      // console.log(res.data)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.catelist = res.data.result
      this.total = res.data.total
      console.log(this.catelist)
    },
    handleSizeChange (newsize) {
      this.params.pagenum = newsize
      this.getcatelist()
    },
    handleCurrentChange (newpage) {
      this.params.pagenum = newpage
      this.getcatelist()
    },
    addcate () {
      this.addcategetlist()
      this.addcateVisible = true
    },
    async addcategetlist () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.addcatelist = res.data
      console.log(this.addcatelist)
    },
    parantcatechange () {
      // console.log(this.selectkeys)
      if (this.selectkeys.length > 0) {
        this.addcateform.cat_pid = this.selectkeys[this.selectkeys.length - 1]
        this.addcateform.cat_level = this.selectkeys.length
      } else {
        this.addcateform.cat_pid = 0
        this.addcateform.cat_level = 0
      }
    },
    addcatemethod () {
      // console.log(this.addcateform)
      this.$refs.addcateformref.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('categories', this.addcateform)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getcatelist()
        this.addcateVisible = false
      })
    },
    addcatedialogclosed () {
      this.$refs.addcateformref.resetFields()
      this.selectkeys = []
      this.addcateform.cat_pid = 0
      this.addcateform.cat_level = 0
    },
    editcatedialog (id) {
      this.editcatedialogVisible = true
      console.log(id.cat_id)
      this.editcatedialogform = id
    },
    async editcatedialogmakesure () {
      const { data: res } = await this.$http.put(`categories/${this.editcatedialogform.cat_id}`, { cat_name: this.editcatedialogform.cat_name })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('编辑商品列表失败')
      this.getcatelist()
      this.editcatedialogVisible = false
      this.$message.success('编辑商品列表成功')
    },
    async detelecatedialog (math) {
      console.log(math)
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      if (result === 'cancel') return this.$message.info('您已取消了删除')
      // console.log(math.cat_id)
      const { data: res } = await this.$http.delete('categories/' + math.cat_id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getcatelist()
    }
  }
}
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 30px
}
.tree-table{
  margin-top: 15px
}
.el-pagination{
  margin-top: 15px
}
.el-cascader{
  width: 100%
}

</style>
