// 配置基地址
axios.defaults.baseURL = 'https://hmajax.itheima.net'

// // 抽取请求提示
function showToast(msg) {
    // 实例化组件  为了让他显示等操作
    const toastDom = document.querySelector('.my-toast')
    const toast = new bootstrap.Toast(toastDom)
    // 渲染接收到的数据
    document.querySelector('.toast-body').innerText = msg
    // 显示在页面上
    toast.show()
}
// // showToast('测试结果')

// 验证token
function verify() {
    // 判断有没有token
    const token = localStorage.getItem('token')
    // 如果没有,隔一段时间后返回登录页
    if (token === null) {
        showToast('请先登录')
        setTimeout(function () {
            location.href = './login.html'
        }, 1500)
    }
}

// 渲染用户名
function renderUsername(selector) {
    // 获取用户名
    // 添加到页面上
    const username = localStorage.getItem('username')
    document.querySelector(selector).innerText = username
}

// 退出功能
function logout() {
    document.querySelector('#logout').addEventListener('click', function () {
        // 清空本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        // 提示用户
        showToast('退出成功')
        // 返回登录页面
        setTimeout(function () {
            location.href = './login.html'
        }, 500)
    })
}

// 渲染页面 拦截器
// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 获取token
    const token = localStorage.getItem('token')
    if (token) config.headers['Authorization'] = token
    return config
}, function (err) {
    return Promise.reject(err)
})
// 相应拦截器
axios.interceptors.response.use(function (response) {
    const { data } = response
    return data
}, function (err) {
    showToast(err.response.data.message)
    // console.dir(err.response.data.message);
    if (err.response.status === 401) {
        // 清空本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        // 提示用户
        showToast('身份验证过期，请重新登录')
        // 返回登录页面
        setTimeout(function () {
            location.href = './login.html'
        }, 500)
    }
    return Promise.reject(err)
})
// 请求拦截器:请求配置项进行加工
// 相应拦截器:对相应结果进行加工