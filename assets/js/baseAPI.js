// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //给所有请求拼接根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

    }

    //全局统一挂载complete函数
    //不论成功还是失败都会执行complete函数
    // //防止通过手写url直接进入后台
    options.complete = function (res) {
        if (res.responseJSON.status === 1) {
            //1.清空localstorage的token
            localStorage.removeItem('token')
            //返回登录页
            location.href = '/1.文章后台管理/login.html'
        }
    }
})