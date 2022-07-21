<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
          <el-alert
            title="消息提示的文案"
            type="info"
            center
            show-icon>
            </el-alert>
            <el-steps :space="200" :active="actionindex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form ref="addformref" :model="addform" label-width="80px" label-position="top" :rules="addformrules">
            <el-tabs :tab-position="'left'" v-model="actionindex" :before-leave="beforetableave" @tab-click="tabclick()">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addform.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price" type="number">
                        <el-input v-model="addform.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addform.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addform.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_number">
                        <el-cascader
                            expandTrigger="hover"
                            v-model="addform.goods_cat"
                            :options="addlist"
                            :props="catelist"
                            @change="handleChange"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                  <el-form-item :label="item.attr_name" v-for="item in manytabledata" :key="item.attr_id">
                    <el-checkbox-group v-model="item.attr_vals">
                      <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border=""></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                  <el-form-item :label="item.attr_name" v-for="item in onlytabledata" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                  <!-- action表示图片要上传到到后台api地址 -->
                  <!-- on-preview处理图片预览效果 -->
                  <!-- on-remove关闭处理图片预览效果 -->
                  <el-upload
                    :action="uploadurl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture"
                    :headers="headerobj"
                    :on-success="handlesuccess">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                  <quill-editor v-model="addform.goods_introduce"></quill-editor>
                  <el-button type="primary" class="btnadd" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
            </el-form>
        </el-card>
        <el-dialog
          title="图片预览"
          :visible.sync="previewVisible"
          width="50%">
          <img :src="previewpath">
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      actionindex: '0',
      addform: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addformrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      addlist: [],
      catelist: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manytabledata: [],
      onlytabledata: [],
      uploadurl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerobj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      pics: [],
      previewpath: '',
      previewVisible: false
    }
  },
  created () {
    this.addgetlist()
  },
  computed: {
    cateid () {
      if (this.addform.goods_cat.length === 3) {
        return this.addform.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async addgetlist () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.message.error('获取商品列表失败')
      this.addlist = res.data
      console.log(this.addlist)
    },
    handleChange () {
      console.log(this.addform.goods_cat)
      if (this.addform.goods_cat.length !== 3) {
        this.addform.goods_cat = []
      }
    },
    beforetableave (activeName, oldActiveName) {
    //   console.log(activeName)
    //   console.log(oldActiveName)
      if (oldActiveName === '0' && this.addform.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabclick () {
      console.log(this.actionindex)
      if (this.actionindex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateid}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          this.$message.error('获取动态参数列表失败')
        }
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manytabledata = res.data
      }
      if (this.actionindex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateid}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          this.$message.error('获取动态参数列表失败')
        }
        console.log(res.data)
        this.onlytabledata = res.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewVisible = true
      console.log(file)
      this.previewpath = file.response.data.url
    },
    // 关闭图片预览效果
    handleRemove (file) {
      // console.log(file)
      const filepath = file.response.data.tmp_path
      const i = this.addform.pics.findIndex(x => x.pic === filepath)
      this.addform.pics.splice(i, 1)
      // console.log(this.addform)
    },
    handlesuccess (response) {
      // console.log(response)
      const picinfo = { pic: response.data.tmp_path }
      this.addform.pics.push(picinfo)
      // console.log(this.addform)
    },
    add () {
      // console.log(this.addform.goods_introduce)
      this.$refs.addformref.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        console.log(this.addform)
        const form = _.cloneDeep(this.addform)
        form.goods_cat = form.goods_cat.join(',')
        this.manytabledata.forEach(item => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addform.attrs.push(newinfo)
        })
        this.onlytabledata.forEach(item => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addform.attrs.push(newinfo)
        })
        form.attrs = this.addform.attrs
        console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.box-card{
    margin-top: 30px;
}
.el-alert{
    margin-top: 15px;
}
.el-steps{
    margin-top: 15px;
}
.el-step_title{
    font-size: 14px;
}
.el-tabs{
    margin-top: 15px;
}
.el-checkbox{
  margin: 0px 10px 10px 0px !important;
}
img{
  width: 100%;
  height: 100%;
}
.btnadd{
  margin-top: 10px;
}
</style>
