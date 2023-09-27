// 整合函数-登录校验
checkLogin()

// 整合函数-渲染用户名
renderUsername()

// 整合函数-退出登录逻辑
registerLogout()

// 抽取函数-获取学员数据
async function getData() {
  // 获取数据
  const res = await axios.get('/students')
  // console.log(res)
  // 渲染数据
  const html = res.data.map(v => {
    const { name, age, gender, group, hope_salary, salary, province, city, area, id } = v
    return `
    <tr>
        <td>${name}</td>
        <td>${age}</td>
        <td>${gender === 0 ? '男' : '女'}</td>
        <td>第${group}组</td>
        <td>${hope_salary}</td>
        <td>${salary}</td>
        <td>${province + city + area}</td>
        <td data-id="${id}">
          <a href="javascript:;" class="text-success mr-3"><i class="bi bi-pen"></i></a>
          <a href="javascript:;" class="text-danger"><i class="bi bi-trash"></i></a>
        </td>
      </tr>
    `
  }).join('')

  document.querySelector('.list').innerHTML = html

  document.querySelector('.total').innerText = res.data.length
}

getData()

// 显示弹框
const modalDom = document.querySelector('#modal')
const modal = new bootstrap.Modal(modalDom)

document.querySelector('#openModal').addEventListener('click', () => {
  // 修改标题
  document.querySelector('.modal-title').innerText = '添加学员'

  // 表单重置
  document.querySelector('#form').reset()

  // 清空籍贯（城市，地区）
  citySelect.innerHTML = '<option value="">--城市--</option>'
  areaSelect.innerHTML = '<option value="">--地区--</option>'

  // 删除自定义属性
  modalDom.dataset.id = ''

  modal.show()
})


// 省市区联动
const proSelect = document.querySelector('[name=province]')
const citySelect = document.querySelector('[name=city]')
const areaSelect = document.querySelector('[name=area]')

async function initSelect() {
  // 省数据获取+渲染
  const proRes = await axios.get('/api/province')
  // console.log(proRes)
  const proHtml = proRes.list.map(v => {
    return `<option value="${v}">${v}</option>`
  }).join('')
  proSelect.innerHTML = `<option value="">--省份--</option>${proHtml}`

  // 市数据获取+渲染
  proSelect.addEventListener('change', async () => {
    const cityRes = await axios.get('/api/city', {
      params: {
        pname: proSelect.value
      }
    })
    const cityHtml = cityRes.list.map(v => {
      return `<option value="${v}">${v}</option>`
    }).join('')
    citySelect.innerHTML = `<option value="">--城市--</option>${cityHtml}`

    // 一会需要清空地区标签的内容，否则会有Bug(停留在上一次的状态)
    areaSelect.innerHTML = `<option value="">--地区--</option>`
  })

  // 区数据获取+渲染
  citySelect.addEventListener('change', async () => {
    const areaRes = await axios.get('/api/area', {
      params: {
        pname: proSelect.value,
        cname: citySelect.value
      }
    })
    const areaHtml = areaRes.list.map(v => {
      return `<option value="${v}">${v}</option>`
    }).join('')
    areaSelect.innerHTML = `<option value="">--地区--</option>${areaHtml}`
  })
}

initSelect()

// 数据新增
document.querySelector('#submit').addEventListener('click', () => {
  if (modalDom.dataset.id) {
    // 后续调用保存修改的函数
    saveEdit()
  } else {
    // 调用新增学员函数
    addStudent()
  }
})

// 函数抽取-新增学员
async function addStudent() {
  // 数据收集+转换+提交
  const form = document.querySelector('#form')
  const data = serialize(form, { hash: true, empty: true })

  data.age = +data.age
  data.gender = +data.gender
  data.hope_salary = +data.hope_salary
  data.salary = +data.salary
  data.group = +data.group
  // console.log(data)
  try {
    // 新增成功
    const res = await axios.post('/students', data)
    showToast(res.message)
    getData()
  } catch (error) {
    // 新增失败
    // console.dir(error)
    showToast(error.response.data.message)
  }
  modal.hide()
}

// 绑定事件
document.querySelector('.list').addEventListener('click', (e) => {
  // 点了删除标签-调用对应的函数
  if (e.target.classList.contains('bi-trash')) {
    // console.log(e.target.parentNode.parentNode.dataset.id)
    const id = e.target.parentNode.parentNode.dataset.id
    delStudent(id)
  }
  // 点了编辑标签-调用对应的函数
  if (e.target.classList.contains('bi-pen')) {
    const id = e.target.parentNode.parentNode.dataset.id
    editStudent(id)
  }
})

// 抽取函数-删除数据
async function delStudent(id) {
  // console.log('点了删除')
  // console.log(id)
  // 获取id+调用接口
  await axios.delete(`/students/${id}`)

  // 重新渲染
  getData()
}

// 抽取函数-编辑学员数据
async function editStudent(id) {
  // console.log('编辑', id)
  const res = await axios.get(`/students/${id}`)

  // 修改标题
  document.querySelector('.modal-title').innerText = '修改学员'

  // 设置输入框(姓名，年龄，组号，期望薪资，就业薪资)
  // 属性名数组
  const keyArr = ['name', 'age', 'group', 'hope_salary', 'salary']
  keyArr.forEach(key => {
    document.querySelector(`[name=${key}]`).value = res.data[key]
  })

  // 设置性别（0 男，1 女）
  const { gender } = res.data
  // 伪数组[男checkbox,女checkbox]
  const chks = document.querySelectorAll('[name=gender]')
  chks[gender].checked = true

  // 设置籍贯
  const { province, city, area } = res.data

  // 设置省（设置select标签的value属性，对应的option会被选中）
  proSelect.value = province

  // 设置市
  const cityRes = await axios.get('/api/city', {
    params: {
      pname: province
    }
  })
  const cityHtml = cityRes.list.map(v => {
    return `<option value="${v}">${v}</option>`
  }).join('')
  citySelect.innerHTML = `<option value="">--城市--</option>${cityHtml}`
  citySelect.value = city

  // 设置区
  const areaRes = await axios.get('/api/area', {
    params: {
      pname: province,
      cname: city
    }
  })
  const areaHtml = areaRes.list.map(v => {
    return `<option value="${v}">${v}</option>`
  }).join('')
  areaSelect.innerHTML = `<option value="">--地区--</option>${areaHtml}`
  areaSelect.value = area

  // 弹框
  modal.show()

  // 保存学员id，用来却分 新增（dataset.id不存在） 编辑（dataset.id有值）
  modalDom.dataset.id = id
}

// 抽取函数-保存修改
async function saveEdit() {
  console.log('保存修改')
  // 数据收集+转换+提交
  const form = document.querySelector('#form')
  const data = serialize(form, { hash: true, empty: true })
  data.age = +data.age
  data.gender = +data.gender
  data.hope_salary = +data.hope_salary
  data.salary = +data.salary
  data.group = +data.group

  try {
    // 修改成功
    const saveRes = await axios.put(`/students/${modalDom.dataset.id}`, data)
    showToast(saveRes.message)
    getData()
  } catch (error) {
    // 修改失败
    // console.dir(error)
    showToast(error.response.data.message)
  }
  modal.hide()
}

