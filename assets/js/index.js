$(function () {
    getUserInfo()

    var layer = layui.layer

    //退出功能
    $('#btnLogout').on('click', function () {
        //调用询问框
        layer.confirm('是否退出登录?', { icon: 3, title: '提示' }, function (index) {
            //1.清空localstorage中的token
            localStorage.removeItem('token')
            //2.退出到登录界面
            location.href = '/1.文章后台管理/login.html'
            layer.close(index);
        })


    })
})

//获取用户信息函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 向请求头加入token来验证用户信息
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },  写在baseapi中
        success: function (res) {

            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败')
            }

            //渲染用户头像
            renderAvatar(res.data)
        }
        // //不论成功还是失败都会执行complete函数
        // //防止通过手写url直接进入后台
        // complete: function (res) {
        //     if (res.responseJSON.status === 1) {
        //         //1.清空localstorage的token
        //         localStorage.removeItem('token')
        //         //返回登录页
        //         location.href = '/1.文章后台管理/login.html'
        //     }
        // }
    })
}

//渲染用户头像函数
function renderAvatar(user) {
    //获取用户名
    var name = user.nickname || user.username
    //显示欢迎
    $('#welcome').html('欢迎! ' + name)

    //按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}