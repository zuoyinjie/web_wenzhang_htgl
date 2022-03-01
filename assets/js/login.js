$(function () {

    $('#go-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })


    $('#go-login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 自定义校验规则
    var form = layui.form
    //定义弹出层
    var layer = layui.layer

    // form.verify自定义校验方式
    form.verify({
        pwd: [
            // [\S}不出现空格  {6，12} 6-12位
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],
        // 设置注册时重复输入密码的校验规则
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return "两次密码输入不一致!"
            }
        }
    })


    //提交注册事件
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()

        // 获取表单信息
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }


        $.post('/api/reguser', data, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')

            //模拟点击跳转至登录界面
            $('#go-login').click()
        })
    })

    //提交登陆事件
    $('#form-login').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 将登录成功得到的 token 字符串，保存到 localStorage 中

                localStorage.setItem('token', res.token)
                // 跳转到后台主页

                location.href = 'index.html'
                layer.msg('登陆成功')
            }
        })
    })

})