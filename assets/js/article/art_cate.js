$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var catStr = template('tpl-table', res)
                $('tbody').html(catStr)
            }
        })
    }

    var indexAdd = null
    $('#btnAddCate').on('click', function (e) {
        indexAdd = layer.open({
            title: '添加目录和类别',
            content: $('#dialog-add').html(),
            type: '1',
            area: ['500px', '300px']
        })
    })


    // 由于表单是在点击添加才产生的 所以不能直接为它添加提交事件
    // 用代理来绑定
    $('body').on('submit', '#cate-form', function (e) {
        e.preventDefault()
        console.log('a')
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) { return layer.msg('添加类别失败') }

                layer.msg('添加类别成功')
                // 渲染
                initArtCateList()
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })

    })

    var indexEdit = null
    $('body').on('click', '#btnEdit', function (e) {
        // console.log('12')
        indexEdit = layer.open({
            title: '修改目录和类别',
            content: $('#dialog-edit').html(),
            type: '1',
            area: ['500px', '300px']
        })

        var id = $(this).attr('data-id')

        // 渲染表单信息
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) { return layer.msg('获取信息失败') }
                form.val('form-edit', res.data)
            }
        })
    })
    //提交修改
    $('body').on('submit', '#cateEdit-form', function (e) {
        e.preventDefault()
        // console.log('a')/
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) { return layer.msg('修改类别失败') }

                layer.msg('修改类别成功')
                // 关闭弹出层
                layer.close(indexEdit)
                // 渲染
                initArtCateList()

            }
        })

    })
    //删除
    $('body').on('click', '#btnDel', function (e) {
        var id = $(this).attr('data-id')

        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })


})