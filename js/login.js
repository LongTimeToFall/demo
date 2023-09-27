/**
 * 用户登录
 *  1. 收集并校验数据
 *  2. 提交数据
 *  3. 缓存响应数据
 *  4. 跳转首页
 * */
document.querySelector('#btn-login').addEventListener('click', async () => {
  // 1. 收集并校验数据
  const form = document.querySelector('.login-form')
  const data = serialize(form, { empty: true, hash: true })
  console.log(data)
  const { username, password } = data
  // 非空判断
  if (username === '' || password === '') {
    showToast('用户名和密码不能为空')
    return
  }

  // 格式判断
  if (username.length < 8 || username.length > 30 || password.length < 6 || password.length > 30) {
    showToast('用户名长度8-30，密码长度6-30')
    return
  }

  // 2. 提交数据
  try {
    const res = await axios.post('/login', { username, password })
    // console.log(res)
    showToast(res.message)
    // 3. 缓存响应数据
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('username', res.data.username)
    // 4. 跳转首页
    // 延迟一会在跳转，让提示框显示
    setTimeout(() => {
      // login.html和index.html的相对关系
      location.href = './index.html'
    }, 1500)

  } catch (error) {
    // console.dir(error)
    showToast(error.response.data.message)
  }

})