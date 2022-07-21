<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="7">
            <div>
                <!-- <el-input placeholder="请输入内容" class="input-with-select" v-model="param.query" clearable clear="getorder">
                <el-button slot="append" icon="el-icon-search" @click="findorder"></el-button>
                </el-input> -->
            </div>
            </el-col>
            </el-row>
            <el-table
                :data="getorderlist"
                style="width: 100%"
                stripe
                border>
                <el-table-column
                        type="index"
                        label="#">
                </el-table-column>
                <el-table-column
                        prop="order_number"
                        label="订单编号"
                        width="600px">
                </el-table-column>
                <el-table-column
                        prop="order_price"
                        label="订单价格"
                        width="150px">
                </el-table-column>
                <el-table-column
                        prop="order_pay"
                        label="是否付款"
                        width="150px">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="is_send"
                        label="是否发货"
                        width="150px">
                </el-table-column>
                <el-table-column
                        prop="update_time"
                        label="下单时间"
                        width="300px">
                </el-table-column>
                <el-table-column
                        label="操作" width="180px" class="table-button">
                        <template slot-scope="scope">
                              <el-button type="primary" icon="el-icon-edit" circle size="small" @click="editaddress(scope)"></el-button>
                              <el-button type="success" icon="el-icon-location-outline" circle size="small" @click="editprogress()"></el-button>
                        </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="param.pagenum"
                    :page-sizes="[10, 15, 20, 25]"
                    :page-size="param.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="this.total">
            </el-pagination>
        </el-card>
        <el-dialog
            title="修改地址"
            :visible.sync="editaddressVisible"
            width="50%" @close="closeeditaddress">
            <el-form ref="editaddressform" :model="addressform" label-width="80px" :rules="editaddressrules">
                <el-form-item label="省市区/县" prop="address1" label-width="90px">
                    <el-cascader
                    expandTrigger="hover"
                    v-model="addressform.address1"
                    :options="citydata"
                    @change="handleChange"
                    clearable>
                </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressform.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editaddressVisible = false">取 消</el-button>
                <el-button type="primary" @click="editaddressVisible = false">确 定</el-button>
            </span>
            </el-dialog>
            <el-dialog
            title="物流进度"
            :visible.sync="editprogressVisible"
            width="50%">
            <el-timeline>
                <el-timeline-item
                v-for="(item, index) in kuai"
                :key="index"
                :timestamp="item.time">
                {{item.context}}
                </el-timeline-item>
            </el-timeline>
            </el-dialog>
    </div>
</template>
<script>
import citydata from './citydata'
import kuai from './kuai.js'
export default {
  data () {
    return {
      getorderlist: [],
      param: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      editaddressVisible: false,
      editcateprops: {
        value: 'order_id',
        label: ''
      },
      addressform: {
        address1: [],
        address2: ''
      },
      editaddressrules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      //   属性名和属性值重名只用写一个
      citydata,
      editprogressVisible: false,
      kuai
    }
  },
  created () {
    this.getorder()
  },
  methods: {
    async getorder () {
      const { data: res } = await this.$http.get('orders', { params: this.param })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.getorderlist = res.data.goods
      console.log(this.getorderlist)
      this.total = res.data.total
    },
    findorder () {
      this.param.pagenum = 1
      this.getorder()
    },
    handleSizeChange (newpage) {
      this.param.pagesize = newpage
      this.getorder()
    },
    handleCurrentChange (newpage) {
      this.param.pagenum = newpage
      this.getorder()
    },
    editaddress (scope) {
      this.editaddressVisible = true
      console.log(scope)
    },
    handleChange () {
    },
    closeeditaddress () {
      this.$refs.editaddressform.resetFields()
    },
    async editprogress () {
      this.editprogressVisible = true
      console.log(this.kuai)
    }
  }
}
</script>
<style lang="less" scoped>
.box-card{
        margin-top: 30px;
}
.el-table{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}

</style>
