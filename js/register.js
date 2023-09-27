// 测试配置结果（axios基地址）
// document.querySelector('#btn-register').addEventListener('click', () => {
//   axios({
//     url: '/register',
//     method: 'post',
//     data: {
//       username: 'itheima666',
//       password: '123456'
//     }
//   })
// })

/**
 * 用户注册
 *  1. 收集并校验数据
 *  2. 数据提交
 * */
document.querySelector('#btn-register').addEventListener('click', async () => {
  // 1. 收集并校验数据
  const form = document.querySelector('.register-form')
  const data = serialize(form, { empty: true, hash: true })
  // console.log(data)
  const { username, password } = data
  console.log(username, password)
  // 非空校验
  if (username === '' || password === '') {
    showToast('用户名和密码不能为空')
    return
  }

  // 长度校验
  if (username.length < 8 || username.length > 30 || password.length < 6 || password.length > 30) {
    showToast('用户名的长度为8-30,密码的长度为6-30')
    return
  }

  // 2. 数据提交
  try {
    // .post 请求方法 post，参数1:请求URL，参数2:提交的数据
    const res = await axios.post('/register', { username, password })
    // console.log(res)
    showToast(res.message)
  } catch (error) {
    // console.dir(error)
    showToast(error.response.data.message)
  }


})