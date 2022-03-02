$(function () {

    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#chooseImage').on('click', function () {
        $('#file').click()
    })


    // 为上传文件表单绑定change事件 当选择文件变化时触发
    $('#file').on('change', function (e) {
        // console.log(e)
        // e的target属性files有关于文件的信息

        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择上传的头像')
        }

        // URL.creatObjUrl可以将文件路径转为url
        var file = e.target.files[0]

        var avatarUrl = URL.createObjectURL(file)

        // 先 销毁 旧的裁剪区域，再 重新设置图片路径 ，之后再 创建新的裁剪区域 ：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', avatarUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //上传头像
    $('#loadAvatar').on('click', function (e) {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换失败')
                }

                layer.msg('更新用户头像成功')
                //渲染用户头像
                window.parent.getUserInfo()
            }
        })

    })
})
