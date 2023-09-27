// 调用判断是否登录的函数
checkLogin()

// 调用渲染用户名的函数
renderUsername()

// 调用退出登录函数 给退出按钮注册点击事件
registerLogout()

// 渲染顶部数据的函数
function renderOverview(overview) {
  Object.keys(overview).forEach(key => {
    // console.log(key)
    document.querySelector(`.${key}`).innerText = overview[key]
  })
}

// 渲染薪资走势
function renderYearSalary(year) {
  // console.log(year)

  // 初始化ECharts实例
  const dom = document.querySelector('#line')
  const myChart = echarts.init(dom)

  // 定义选项和数据
  const option = {
    // 标题
    title: {
      text: '2022年薪资走势',
      // left,top分别设置，距离容器左侧和顶部的距离
      left: '12',
      top: '15'
    },
    // 绘图网络
    grid: {
      top: '20%'
    },
    // y轴
    yAxis: {
      // 坐标轴类型 value，连续数据
      type: 'value',
      // 调整分割线为虚线
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    // x轴
    xAxis: {
      // 坐标轴类型，类目轴
      type: 'category',
      // 坐标轴轴线相关设置
      axisLine: {
        // 线段样式
        lineStyle: {
          // 线的类型
          type: 'dashed',
          // 线的颜色，修改之后，文字也会一起变色
          color: '#ccc'
        }
      },
      // 数据
      data: year.map(v => v.month)
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    // 系列图表
    series: [
      {
        // 数据，随机的统计数据，每次刷新图表都可能不一样
        data: year.map(v => v.salary),
        // data: [820, 932, 901, 1200, 1290, 1330, 1320],
        // 标记的大小
        symbolSize: 10,
        // 线的样式
        lineStyle: {
          // 线宽
          width: 8,
          // 颜色
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0, color: '#479dee' // 0% 处的颜色
            }, {
              offset: 1, color: '#5c75f0' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        // 折线图
        type: 'line',
        // 平滑曲线，true开启
        smooth: true,
        // 区域填充样式
        areaStyle: {
          // 填充颜色
          // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
          color:
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#b2d7f7' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(255,255,255,0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ],
    // 提示框
    tooltip: {
      // 如果要show生效，需要设置tooltip属性，默认就是显示
      show: true, // false隐藏
      // 触发方式坐标轴
      trigger: 'axis'
    }
  }

  // 基于选项和数据绘制图表
  myChart.setOption(option)
}

// 渲染薪资分布函数
function renderSalary(salaryData) {
  // console.log(salaryData)

  // 初始化实例
  const dom = document.querySelector('#salary')
  const myChart = echarts.init(dom)

  // 定义属性和数据
  const option = {
    title: {
      text: '班级薪资分布',
      left: 10,
      top: 15
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      // top: '5%',
      // 离容器下侧的距离
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: '班级薪资分布',
        // type=pie 饼图
        type: 'pie',
        // 数组的第一项是内半径，第二项是外半径
        radius: ['55%', '70%'],
        // 图形样式
        itemStyle: {
          // 半径
          borderRadius: 15,
          // 颜色
          borderColor: '#fff',
          // 粗细
          borderWidth: 2
        },
        // 高亮状态的扇区和标签样式
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 100,
        //     fontWeight: 'bold'
        //   }
        // },
        // 饼状图说明文本
        label: {
          show: false,
          // show: true,
          // position: 'center'
        },
        // 说明文本的指引线
        labelLine: {
          show: false
          // show: true
        },
        // 是否启用防止标签重叠策略，默认开启
        // avoidLabelOverlap: false,
        data: salaryData.map(v => {
          return {
            value: v.g_count + v.b_count,
            name: v.label
          }
        })
        //   [
        //   { value: 1048, name: 'Search Engine' },
        //   { value: 735, name: 'Direct' },
        //   { value: 580, name: 'Email' },
        //   { value: 484, name: 'Union Ads' },
        //   { value: 300, name: 'Video Ads' }
        // ]
      }
    ],
    // 颜色
    color: ['#fda224', '#5097ff', '#3abcfa', '#34d39a']
  }

  // 根据属性和数据绘制图表
  myChart.setOption(option)
}

// 渲染每组薪资函数
function renderGroupSalary(groupData) {
  // console.log(groupData)

  // 初始化实例
  const dom = document.querySelector('#lines')
  const myChart = echarts.init(dom)

  // 定义选项和数据
  const option = {
    // 显示提示框
    tooltip: {},
    // 绘图网络
    grid: {
      left: 70,
      top: 30,
      right: 30,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      // 默认渲染第一组的数据
      data: groupData[1].map(v => v.name),
      // 线的类型，颜色，文字的颜色
      axisLine: {
        lineStyle: {
          color: '#ccc',
          type: 'dashed'
        }
      },
      // 坐标轴刻度标签的相关设置
      axisLabel: {
        // 刻度标签文字的颜色
        color: '#999'
      }
    },
    yAxis: {
      type: 'value',
      // 分割线的类型
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    // series中设置多个图形，就会渲染多个图形
    series: [
      {
        name: '期望薪资',
        // data: [120, 200, 150, 80, 70, 110, 130],
        data: groupData[1].map(v => v.hope_salary),
        type: 'bar',
        // 柱状图的样式
        itemStyle: {
          // 柱状图的颜色
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#34D39A' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(52,211,154,0.2)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      },
      {
        name: '实际薪资',
        // data: [120, 200, 150, 80, 70, 110, 130],
        data: groupData[1].map(v => v.salary),
        type: 'bar',
        // 柱状图的样式
        itemStyle: {
          // 柱状图的颜色
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#499FEE' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(73,159,238,0.2)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  }

  // 基于选项和数据绘制图表
  myChart.setOption(option)


  // 高亮切换
  const btns = document.querySelector('#btns')
  btns.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
      // console.log('点了按钮')
      btns.querySelector('.btn-blue').classList.remove('btn-blue')
      e.target.classList.add('btn-blue')

      // 数据切换
      const index = e.target.innerText
      // console.log(index)
      const data = groupData[index]

      option.xAxis.data = data.map(v => v.name)
      option.series[0].data = data.map(v => v.hope_salary)
      option.series[1].data = data.map(v => v.salary)

      // 重新渲染
      myChart.setOption(option)
    }
  })

}

// 渲染男女薪资分布函数
function renderGenderSalary(salaryData) {
  // console.log(salaryData)

  // 初始化实例
  const dom = document.querySelector('#gender')
  const myChart = echarts.init(dom)

  // 定义选项和数据
  const option = {
    tooltip: {
      trigger: 'item'
    },
    // 不写legend 不会显示图例组件
    // legend: {
    //   top: '5%',
    //   left: 'center'
    // },
    // 颜色
    color: ['#fda224', '#5097ff', '#3abcfa', '#34d39a'],
    // 标题，通过数组设置多个
    title: [
      {
        text: '男女薪资分布',
        left: 10,
        top: 10,
        // text属性的样式
        textStyle: {
          // 文字的大小
          fontSize: 16
        }
      },
      {
        text: '男生',
        left: '50%',
        top: '45%',
        textStyle: {
          fontSize: 12
        },
        textAlign: 'center'
      },
      {
        text: '女生',
        left: '50%',
        top: '85%',
        textStyle: {
          fontSize: 12
        },
        textAlign: 'center'
      }
    ],
    series: [
      {
        type: 'pie',
        radius: ['20%', '30%'],
        // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
        center: ['50%', '30%'],
        data: salaryData.map(v => {
          return { value: v.b_count, name: v.label }
        })
      },
      {
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '70%'],
        data: salaryData.map(v => {
          return { value: v.g_count, name: v.label }
        })
        // data: [
        //   { value: 1048, name: 'Search Engine' },
        //   { value: 735, name: 'Direct' },
        //   { value: 580, name: 'Email' },
        //   { value: 484, name: 'Union Ads' },
        //   { value: 300, name: 'Video Ads' }
        // ]
      }
    ]
  }

  // 基于选项和数据绘制图表
  myChart.setOption(option)
}

// 渲染籍贯分布
function renderProvince(provinceData) {
  // console.log(provinceData)
  const dom = document.querySelector('#map')
  const myEchart = echarts.init(dom)
  const dataList = provinceData.map(item => {
    return { name: item.name, value: 0 }
  })

  // 筛选数据
  dataList.forEach(item => {
    const res = provinceData.find(v => {
      return v.name.includes(item.name)
    })
    // console.log(res)
    // 数据赋值
    if (res !== undefined) {
      item.value = res.value
    }
  })
  // console.log(dataList)

  const option = {
    title: {
      text: '籍贯分布',
      top: 10,
      left: 10,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {} 位学员',
      borderColor: 'transparent',
      backgroundColor: 'rgba(0,0,0,0.5)',
      textStyle: {
        color: '#fff',
      },
    },
    visualMap: {
      min: 0,
      max: 6,
      left: 'left',
      bottom: '20',
      text: ['6', '0'],
      inRange: {
        color: ['#ffffff', '#0075F0'],
      },
      show: true,
      left: 40,
    },
    geo: {
      map: 'china',
      roam: false,
      zoom: 1.0,
      label: {
        normal: {
          show: true,
          fontSize: '10',
          color: 'rgba(0,0,0,0.7)',
        },
      },
      itemStyle: {
        normal: {
          borderColor: 'rgba(0, 0, 0, 0.2)',
          color: '#e0ffff',
        },
        emphasis: {
          areaColor: '#34D39A',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 20,
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
    series: [
      {
        name: '籍贯分布',
        type: 'map',
        geoIndex: 0,
        data: dataList,
      },
    ],
  }
  myEchart.setOption(option)
}

// 首页-统计数据
async function getData() {

  // 使用拦截器的写法（只保留核心逻辑即可）
  const res = await axios({
    url: '/dashboard',
  })
  // const overview = res.data.overview
  // 通过解构语法，简化数据取值
  // console.log(res)
  const { overview, year, salaryData, groupData, provinceData } = res.data

  // 调用函数-渲染顶部数据
  renderOverview(overview)

  // 调用函数-渲染薪资走势
  renderYearSalary(year)

  // 调用函数-渲染薪资分布
  renderSalary(salaryData)

  // 调用函数-渲染每组薪资
  renderGroupSalary(groupData)

  // 调用函数-渲染男女薪资分布
  renderGenderSalary(salaryData)

  // 调用函数-渲染籍贯分布
  renderProvince(provinceData)

  // 渲染数据
  // Object.keys(overview).forEach(key => {
  //   // console.log(key)
  //   document.querySelector(`.${key}`).innerText = overview[key]
  // })

  // 没有使用拦截器的写法----------------
  // 读取缓存中的token
  // const token = localStorage.getItem('token')
  // try {
  //   // 调用接口(登录成功之后才可以调用)
  //   const res = await axios({
  //     url: '/dashboard',
  //     // 请求头中携带token
  //     // 不携带token，直接报错
  //     // headers: {
  //     //   Authorization: token
  //     // }
  //   })
  //   const overview = res.data.data.overview

  //   // 渲染数据
  //   Object.keys(overview).forEach(key => {
  //     // console.log(key)
  //     document.querySelector(`.${key}`).innerText = overview[key]
  //   })
  // } catch (error) {
  //   // 首页-登录状态过期
  //   // 判断token失效（状态码401）:token过期，token被篡改
  //   // console.dir(error)
  //   // if (error.response.status === 401) {
  //   //   // 删除缓存并提示用户
  //   //   localStorage.removeItem('username')
  //   //   localStorage.removeItem('token')
  //   //   // 使用普通用户可以理解的方式提示他们
  //   //   showToast('请重新登录')

  //   //   // 返回登录页
  //   //   setTimeout(() => {
  //   //     location.href = 'login.html'
  //   //   }, 1500)
  //   // }
  // }

}

getData()







