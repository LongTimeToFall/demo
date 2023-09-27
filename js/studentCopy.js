// 调用验证token的函数
verify()

// 调用渲染用户名的函数
renderUsername('.username')

// 退出
logout()

// 渲染
async function render() {
  const res = await axios({ url: '/students' })
  console.log(res)
  document.querySelector('.row .list').innerHTML = res.data.map(item => {
    return `<tr>
                    <td>${item.name}</td>
                    <td>${item.age}</td>
                    <td>${item.gender}</td>
                    <td>第${item.group}组</td>
                    <td>${item.hope_salary}</td>
                    <td>${item.salary}</td>
                    <td>${item.province}${item.city}${item.area}</td>
                    <td>
                      <a href="javascript:;" class="text-success mr-3"><i class="bi bi-pen" data-id="${item.id}"></i></a>
                      <a href="javascript:;" class="text-danger"><i class="bi bi-trash" data-id="${item.id}"></i></a>
                    </td>
                </tr>`
  }).join('')

  document.querySelector('.total').innerHTML = `${res.data.length}`
}
render()

//#region  增加 
// 实例化
const modelEle = document.querySelector('.modal')
const model = new bootstrap.Modal(modelEle)
// 获取地区表单
const form = document.querySelector('form')
const province = document.querySelector('[name=province]')
const city = document.querySelector('[name=city]')
const area = document.querySelector('[name=area]')
// 获取按钮添加事件
document.querySelector('#openModal').addEventListener('click', function () {
  document.querySelector('.modal-title').innerText = '添加学员'
  form.reset()
  city.innerHTML = '<option value="">--城市--</option>'
  area.innerHTML = '<option value="">--地区--</option>'
  model.show()
})
// 提交
document.querySelector('#submit').addEventListener('click', async function () {
  // 获取表单数据
  const form = document.querySelector('#form')
  const data = serialize(form, { hash: true, empty: true })
  // console.log(data);

  // 转换成需要的类型
  data.age = +data.age
  data.gender = +data.gender
  data.hope_salary = +data.hope_salary
  data.salary = +data.salary
  data.group = +data.group

  try {  // 发起请求
    const res = await axios.post('/students', data)
    showToast(res.message)

    // 渲染
    render()
  } catch (error) { }

  // 退出弹层
  model.hide()
})

// 表单改变
async function formChange() {
  const res = await axios.get('/api/province')
  // console.log(res);
  const list = res.list.map(item => `<option value="${item}">${item}</option>`).join('')
  province.innerHTML = '<option value="">--省份--</option>' + list

  province.addEventListener('change', async function () {
    const res = await axios.get('/api/city', { params: { pname: province.value } })
    const list = res.list.map(item => `<option value="${item}">${item}</option>`).join('')
    city.innerHTML = list
  })

  city.addEventListener('change', async function () {
    const res = await axios.get('/api/area', { params: { pname: province.value, cname: city.value } })
    const list = res.list.map(item => `<option value="${item}">${item}</option>`).join('')
    area.innerHTML = list
  })
}
formChange()
//#endregion

//#region  删除和编辑
// 利用事件委托
document.querySelector('.list').addEventListener('click', async function (e) {
  console.log(e.target);
  // 判断点击的是哪个
  // 删除
  if (e.target.classList.contains('bi-trash')) {
    // 获取id
    const id = e.target.dataset.id
  }
  // 编辑
  if (e.target.classList.contains('bi-pen')) {
    const id = e.target.dataset.id
    document.querySelector('.modal-title').innerText = '编辑学员'

    // 回显
    const res = await axios.get(`/students/${id}`)
    console.log(res);
    // 表单内容
    const keyArr = ['name', 'age', 'group', 'hope_salary', 'salary']
    keyArr.forEach(key => {
      document.querySelector(`[name=${key}]`).value = res.data[key]
    })
    // 地区内容
    console.log(res);
    province.value = res.data.province
    // city.value
    // area.value = `<option value="">${res.data.area}</option>`

    model.show()

    document.querySelector('#submit').addEventListener('click', async function () {
      // 获取表单数据
      const form = document.querySelector('#form')
      const data = serialize(form, { hash: true, empty: true })
      // console.log(data);

      // 转换成需要的类型
      data.age = +data.age
      data.gender = +data.gender
      data.hope_salary = +data.hope_salary
      data.salary = +data.salary
      data.group = +data.group

      try {  // 发起请求
        const res = await axios.post('/students', data)
        showToast(res.message)

        // 渲染
        render()
      } catch (error) { }

      // 退出弹层
      model.hide()
    })

    // 表单改变
    // async function formChange() {

    //   province.addEventListener('change', async function () {
    //     const res = await axios.get('/api/city', { params: { pname: province.value } })
    //     const list = res.list.map(item => `<option value="${item}">${item}</option>`).join('')
    //     city.innerHTML = list
    //   })

    //   city.addEventListener('change', async function () {
    //     const res = await axios.get('/api/area', { params: { pname: province.value, cname: city.value } })
    //     const list = res.list.map(item => `<option value="${item}">${item}</option>`).join('')
    //     area.innerHTML = list
    //   })
    // }
    // formChange()
  }
})
//#endregion
