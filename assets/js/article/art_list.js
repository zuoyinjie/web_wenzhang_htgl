$(function () {
    // 定义查询参数q 每次请求获取文章列表数据要传递他
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    var q = {
        pagenum: '1',
        pagesize: '2',
        cate_id: '',
        state: ''
    }
    //获取信息
    initTable()
    //初始类别
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log(res)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //渲染页码
                renderPage(res.total)
            }
        })
    }

    //定义美化时间过滤器
    template.defaults.imports.dateFormat = function (date) {
        //补零函数
        function padZero(n) {
            return n > 9 ? n : '0' + n
        }


        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 筛选下拉菜单
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //一开始调用的layui.js直接渲染了无下拉
                //layui监听不到获取到的类别 无法渲染
                //要调用下面这
                form.render()
            }
        })
    }

    //筛选提交进行筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    //渲染分页区域
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示几条
            curr: q.pagenum,//默认选中的页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//页码区域的各种功能
            limits: [2, 3, 5, 10],//定义每页可显示的个数
            //1.分页切换触发时触发jump
            //2.laypage.render被调用时也会触发jump
            //函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            jump: function (obj, first) {
                //obj.curr当前页码
                q.pagenum = obj.curr
                //根据最新的页码获取列表并渲染
                // initTable() 若这行直接调用渲染表格 则会无限死循环 页码不能用

                //obj.limit 得到每页显示条数 当切换每页显示条数被触发时也会调用jump
                q.pagesize = obj.limit

                //first参数用于查看是以第一种方式触发jump还是第二种方式
                //first 为true 使第二种方式
                //first 为undefine 是第一种方式
                //只要判断我们是切换分页触发jump则就调用渲染页面
                //因为第一种 在加载时直接就会出来

                if (!first) {
                    initTable()
                }
            }
        });
    }

    //实现删除
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length

        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('删除时出现错误')
                    }

                    layer.msg('删除成功')
                    //当一页的数据删完时需要判断当前页是否还有数据
                    //若没有则让当前页码减一再显示并调用inittable
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });

    })
})