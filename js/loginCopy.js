// 登录
document.querySelector('#btn-login').addEventListener('click', async function () {
    // 获取数据
    const form = document.querySelector('.login-form')
    const data = serialize(form, { hash: true, empty: true })
    // 校验数据 非空 长度
    if (data.username.trim() === '' || data.password.trim() === '') {
        return showToast('用户名或密码不能为空')
    }
    if (data.username.length < 8 || data.username.length > 30 || data.password.length < 6 || data.password.length > 30) {
        return showToast('用户名长度为8-30，密码长度为6-30')
    }
    // 提交数据
    const res = await axios.post('/login', data)
    // 测试
    // console.log(res);
    // 添加到缓存区（本地存储）
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('username', res.data.username)
    // 提示用户
    showToast(res.message)
    // 跳转页面
    setTimeout(function () {
        location.href = './index.html'
    }, 500)
    // dalaoxiaomidi
})