// 调用验证token的函数
verify()

// 调用渲染用户名的函数
renderUsername('.username')

// 退出
logout()

// 渲染页面
async function getData() {
    // data请求体参数
    // headers请求头参数
    // params查询参数
    const res = await axios({ url: '/dashboard' })
    console.log(res.data.provinceData);
    // 解构获取的数据
    const { overview, groupData, provinceData, salaryData, year } = res.data
    // overview 部分渲染  转为数组 遍历 找到对应属性 赋值
    Object.keys(overview).forEach(key => { document.querySelector(`.${key}`).innerText = overview[key] })
    // year  薪资走势
    renderYear(year)
    // salaryData  薪资分布
    renderSalary(salaryData)
    // groupData  每组薪资
    renderGroup(groupData)
    // provinceData  男女薪资
    renderProvince(salaryData)
    // 籍贯分布
    renderMap(provinceData)
}
getData()

// year  薪资走势
function renderYear(year) {
    const line = document.querySelector('#line')
    const myChart = echarts.init(line)
    const option = {
        title: {
            text: '2022年薪资走势'
        },

        xAxis: {
            type: 'category',
            data: year.map(item => item.month)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: year.map(item => item.salary),
                type: 'line',
                smooth: true,
                symbolSize: 12,
                lineStyle: {
                    width: 10,
                    color: {
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0, color: '#479dee' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#5c75f0' // 100% 处的颜色
                        }]
                    }
                },
                areaStyle: {
                    color:
                    {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#b2d7f7'
                        }, {
                            offset: 1, color: 'rgba(255,255,255,0)'
                        }]
                    }
                }
            }

        ],
        tooltip: {
            trigger: 'axis',
        }
    };
    myChart.setOption(option)
}

// salaryData  薪资分布
function renderSalary(salaryData) {
    const line = document.querySelector('#salary')
    const myChart = echarts.init(line)
    const option = {
        title: {
            text: '班级薪资分布',
            left: 10,
            top: 15
        },
        legend: {
            bottom: 'bottom'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '班级薪资分布',
                type: 'pie',
                radius: ['60%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                },
                labelLine: {
                    show: true
                },
                data: salaryData.map(item => {
                    return {
                        value: item.g_count + item.b_count,
                        name: item.label
                    }
                })
            }
        ]
    };
    myChart.setOption(option)
}

// groupData  每组薪资
function renderGroup(groupData) {
    const line = document.querySelector('#lines')
    const myChart = echarts.init(line)
    let option = {
        tooltip: {},
        grid: {
            left: 70,
            top: 30,
            right: 30,
            bottom: 50
        },
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            data: groupData[1].map(item => item.name)
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [{
            type: 'bar',
            name: '期望薪资',
            data: groupData[1].map(item => item.hope_salary),
            itemStyle: {
                width: 10,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#34D39A'
                    }, {
                        offset: 1, color: 'rgba(52,211,154,0.2)'
                    }]
                }
            }
        }, {
            type: 'bar',
            name: '实际薪资',
            data: groupData[1].map(item => item.salary),
            itemStyle: {
                width: 10,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#499FEE'
                    }, {
                        offset: 1, color: 'rgba(73,159,238,0.2)'
                    }]
                }
            }
        }]
    };
    myChart.setOption(option)

    const btns = document.querySelector('#btns')
    btns.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn')) {
            btns.querySelector('.btn-blue').classList.remove('btn-blue')
            e.target.classList.add('btn-blue')
            // 获取数字
            const index = e.target.innerText
            // console.log(index)
            const data = groupData[index]
            // console.log(data);
            option.xAxis.data = data.map(item => item.name)
            option.series[0].data = data.map(item => item.hope_salary)
            option.series[1].data = data.map(item => item.salary)

            myChart.setOption(option)
        }
    })
}

// salaryData  男女薪资
function renderProvince(salaryData) {
    const line = document.querySelector('#gender')
    const myChart = echarts.init(line)
    const option = {
        title: [
            {
                text: '男女薪资分布',
                left: 10,
                top: 10,
                textStyle: {
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
                center: ['50%', '30%'],
                data: salaryData.map(item => {
                    return { value: item.b_count, name: item.label }
                })
            },
            {
                type: 'pie',
                radius: ['20%', '30%'],
                center: ['50%', '70%'],
                data: salaryData.map(v => {
                    return { value: v.g_count, name: v.label }
                })
            }
        ],
        tooltip: {
            trigger: 'item'
        }
    };
    myChart.setOption(option)
}

// 籍贯分布
function renderMap(provinceData) {
    const dom = document.querySelector('#map')
    const myEchart = echarts.init(dom)
    // 
    const dataList = [
        { name: '南海诸岛', value: 0 },
        { name: '北京', value: 0 },
        { name: '天津', value: 0 },
        { name: '上海', value: 0 },
        { name: '重庆', value: 0 },
        { name: '河北', value: 0 },
        { name: '河南', value: 0 },
        { name: '云南', value: 0 },
        { name: '辽宁', value: 0 },
        { name: '黑龙江', value: 0 },
        { name: '湖南', value: 0 },
        { name: '安徽', value: 0 },
        { name: '山东', value: 0 },
        { name: '新疆', value: 0 },
        { name: '江苏', value: 0 },
        { name: '浙江', value: 0 },
        { name: '江西', value: 0 },
        { name: '湖北', value: 0 },
        { name: '广西', value: 0 },
        { name: '甘肃', value: 0 },
        { name: '山西', value: 0 },
        { name: '内蒙古', value: 0 },
        { name: '陕西', value: 0 },
        { name: '吉林', value: 0 },
        { name: '福建', value: 0 },
        { name: '贵州', value: 0 },
        { name: '广东', value: 0 },
        { name: '青海', value: 0 },
        { name: '西藏', value: 0 },
        { name: '四川', value: 0 },
        { name: '宁夏', value: 0 },
        { name: '海南', value: 0 },
        { name: '台湾', value: 0 },
        { name: '香港', value: 0 },
        { name: '澳门', value: 0 },
    ]

    // 筛选数据
    dataList.forEach(item => {
        const res = provinceData.find(v => {
            return v.name.includes(item.name)
        })
        // 数据赋值
        if (res !== undefined) {
            item.value = res.value
        }
    })

    const option = {
        title: {
            text: '籍贯分布',
            top: 10,
            left: 10
        },
        tooltip: {
            trigger: 'item',
            // 
            formatter: '{b}: {c} 位学员',
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