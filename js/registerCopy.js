// 测试基地址
// axios({
//     url: '/register',
//     method: 'post',
//     data: {
//         username: 'itheimahanxin',
//         password: '123456'
//     }
// }).then(res => {
//     console.log(res);
// })

// 注册
document.querySelector('#btn-register').addEventListener('click', async function () {
    // 获取表单数据
    const form = document.querySelector('.register-form')
    const data = serialize(form, { hash: true, empty: true })
    // 校验
    if (data.username.trim() === '' || data.password.trim() === '') {
        return showToast('用户名和密码不能为空')
    }
    if (data.username.length < 8 || data.username.length > 30 || data.password.length < 6 || data.password.length > 30) {
        return showToast('用户名长度在8到30位，密码长度在6到30位')
    }
    // 发起请求
    const res = await axios.post('/register', data)
    // console.log(res);
    showToast(res.message)
})