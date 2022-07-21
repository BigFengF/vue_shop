<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
          <el-row :gutter="20">
                    <el-col :span="7">
                        <div>
                            <el-input placeholder="请输入内容" class="input-with-select" v-model="params.query" clearable @clear="getgoodslist">
                            <el-button slot="append" icon="el-icon-search" @click="findgetgoodslist"></el-button>
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" class="userbutton" @click="addgoodslist">添加商品</el-button>
                    </el-col>
          </el-row>
          <el-table
          :data="goodslist"
          style="width: 100%"
          stripe>
          <el-table-column
                        type="index"
                        label="#">
          </el-table-column>
          <el-table-column
                        prop="goods_name"
                        label="商品名称">
          </el-table-column>
          <el-table-column
                        prop="goods_price"
                        label="商品价格"
                        width="180">
          </el-table-column>
          <el-table-column
                        prop="goods_weight"
                        label="商品重量"
                        width="180">
          </el-table-column>
          <el-table-column
                        prop="add_time"
                        label="创建时间"
                        width="180">
          </el-table-column>
          <el-table-column
                        label="操作" width="180px" class="table-button">
                        <template slot-scope="scope">
                          <el-button type="primary" icon="el-icon-edit" size="small" @click="showlistdialog(scope.row)"></el-button>
                          <el-button type="danger" icon="el-icon-delete" size="small" @click="removelistbyid(scope.row)"></el-button>
                        </template>
          </el-table-column>
          </el-table>
          <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="params.pagenum"
                    :page-sizes="[10, 15, 20, 25]"
                    :page-size="params.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="this.total">
                    </el-pagination>
        </el-card>
        <!-- <el-dialog
                title="添加商品列表"
                :visible.sync="listVisible"
                width="50%" @close="listclosed">
                <el-form :model="listform" :rules="listformrules" ref="listformref" label-width="70px">
                    <el-form-item label="商品名称" prop="listname" label-width="100px">
                        <el-input v-model="listform.listname"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="listprice" label-width="100px">
                        <el-input v-model="listform.listprice"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="listweight" label-width="100px">
                        <el-input v-model="listform.listweight"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="listtime" label-width="100px">
                        <el-input v-model="listform.listtime"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="listVisible = false">取 消</el-button>
                <el-button type="primary" @click="addlistclick">确 定</el-button>
                </span>
        </el-dialog> -->
        <el-dialog
                title="修改商品列表"
                :visible.sync="editlistVisible"
                width="50%" @close="editlistclosed">
                <el-form :model="editlistform" :rules="editlistformrules" ref="editlistformref" label-width="70px">
                    <el-form-item label="商品名称" prop="goods_name" label-width="100px">
                        <el-input v-model="editlistform.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price" label-width="100px">
                        <el-input v-model="editlistform.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight" label-width="100px">
                        <el-input v-model="editlistform.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="upd_time" label-width="100px">
                        <el-input v-model="editlistform.upd_time"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editlistVisible = false">取 消</el-button>
                <el-button type="primary" @click="addeditlistclick">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
import { newDate } from '../../data'
export default {
  data () {
    return {
      goodslist: [],
      params: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      listVisible: false,
      editlistVisible: false,
      listform: {
        listname: '',
        listprice: '',
        listweight: '',
        listtime: ''
      },
      listformrules: {
        listname: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        listprice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        listweight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        listtime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ]
      },
      editlistform: {},
      editlistformrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        upd_time: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getgoodslist()
  },
  methods: {
    async getgoodslist () {
      const { data: res } = await this.$http.get('goods', { params: this.params })
      if (res.meta.status !== 200) return this.$message.error('访问商品列表失败')
      this.goodslist = res.data.goods
      for (var i = 0; i < this.goodslist.length; i++) {
        const newdate = newDate(this.goodslist[i].add_time)
        this.goodslist[i].add_time = newdate
      }
      this.total = res.data.total
      // console.log(res)
    },
    handleSizeChange (newsize) {
      this.params.pagesize = newsize
      this.getgoodslist()
    },
    handleCurrentChange (newpage) {
    //   console.log(newpage)
      this.params.pagenum = newpage
      this.getgoodslist()
    },
    async showlistdialog (row) {
      this.editlistVisible = true
      console.log(row)
      this.editlistform = row
      console.log(this.editlistform)
    },
    async removelistbyid (row) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      // console.log(row)
      if (result === 'cancel') this.$message.info('您已取消了删除')
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getgoodslist()
      this.$message.success('删除成功')
    },
    listclosed () {
      this.$refs.listformref.resetFields()
    },
    editlistclosed () {
      this.$refs.editlistformref.resetFields()
    },
    // async addlistclick () {
    //   const { data: res } = await this.$http.post('goods',
    //     {
    //       goods_name: this.listform.listname,
    //       goods_cat: '1,2,3',
    //       goods_price: this.listform.listprice,
    //       goods_number: 1,
    //       goods_weight: this.listform.listweight
    //     })
    //   if (res.meta.status !== 201) return this.$message.error('添加商品失败')
    //   // console.log(res)
    //   this.getgoodslist()
    //   this.listVisible = false
    //   return this.$message.success('添加商品成功')
    // },
    async addeditlistclick () {
      const { data: res } = await this.$http.put(`goods/${this.editlistform.goods_id}`, {
        goods_name: this.editlistform.goods_name,
        goods_price: this.editlistform.goods_price,
        goods_number: this.editlistform.goods_number,
        goods_weight: this.editlistform.goods_weight,
        goods_introduce: '',
        pics: '',
        attrs: ''
      })
      console.log(res)
    },
    findgetgoodslist () {
      this.params.pagenum = 1
      this.getgoodslist()
    },
    addgoodslist () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style scoped>
.box-card{
        margin-top: 30px;
    }

</style>
