<template>
    <div>
            <div id="main" class="main" style="weight:1200px; height: 1200px;"></div>
        <!-- </el-card> -->
    </div>
</template>
<script>
// 导入echarts
import * as echarts from 'echarts'
import chinaMap from './china.js'
// import _ from 'lodash'
export default {
  data () {
    return {
      // options: {
      //   title: {
      //     text: '用户来源'
      //   },
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'cross',
      //       label: {
      //         backgroundColor: '#E9EEF3'
      //       }
      //     }
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: [
      //     {
      //       boundaryGap: false
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value'
      //     }
      //   ]
      // }
    }
  },
  created () {
    // this.getEcharts()
  },
  mounted () {
    this.getEcharts()
  },
  methods: {
    getEcharts () {
      echarts.registerMap("china", { geoJSON: chinaMap })
      var myChart = echarts.init(document.getElementById('main'))
        var option = {}
        myChart.setOption(option)
    }
  }

}
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 30px;
}
</style>
