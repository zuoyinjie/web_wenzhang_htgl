$(function () {
    var form = layui.form


    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'

            }
        }
    })
    initUserInfo()

    //表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    //更新用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //window.parent 返回当前窗口的父窗口
                //即iframe 的父窗口index.html
                layer.msg('更新用户信息成功')
                window.parent.getUserInfo()
            }
        })
    })

})


function initUserInfo() {
    var form = layui.form
    var layer = layui.layer
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }

            // console.log(res)
            //为表单赋值
            form.val('userInfoForm', res.data)
        }

    })
}