$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须是6-12位，且不能有空格'],
        samePwd: function (value) {
            if (value === $('#oldpwd').val()) {
                return '新密码不能与旧密码一致'
            }
        },
        rePwd: function (value) {
            if (value !== $('#newpwd').val()) {
                return '两次输入密码不一致'
            }
        }
    })

    //提交新密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                layer.msg('更新用户密码成功')

                //重置表单
                $('input').val('')
            }
        })
    })

})