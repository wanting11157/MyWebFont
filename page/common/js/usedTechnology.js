//layui模块的定义
layui.define(['jquery'], function(exports){

    let technology = {};
    technology.form = {};
    technology.form.name = 'lwt';
    technology.getName = () => {};

    exports('user', technology);
});





layui.use(['layedit','jquery','form','tree','user'], function() {
    var layedit = layui.layedit;
    var $ = layui.jquery;
    var form = layui.form;
    var tree = layui.tree;
    // var layer = layui.layer;
    let aaa = layui.user;

    let myname = aaa.getName();
    let name = aaa.form.name;

    // $(document.body).on('click','#zzz',function () {
    //     layer.msg('click')
    // });


    let index;
    index = layedit.build('LAY_demo1');






    form = $("#fff").Seriable(



    )
    layedit.set({
        uploadImage: {
            url: '/api/know/fuwenben' //接口url
            ,type: 'post' //默认post
        }
        // height: 800
    });

    $("#genAdd").click(function(){
        $.ajax({
            url:'/api/know/genAdd',
            type:'POST',
            success:function(res){
                // layer.msg(res);
                if(res && res.code == 500){
                    layer.msg("增加根节点失败");


                }else{
                    loadData();
                    layer.msg("增加根节点成功");
                }

            },
            error:function(){
                layer.msg("增加根节点异常");
            }
        })
    });
    form.on('submit(tijiao)', function(data){
        data.field.content=layedit.getContent(index).trim();
        $.ajax({
            url:'/api/know/submit',
            data:data.field,
            type:'POST',
            success:function(res){
                // layer.msg(res);
                if(res && res.code == 500){
                    layer.msg("提交失败");


                }else{
                    layer.msg("提交成功");
                    loadData();
                }

            },
            error:function(){
                layer.msg("提交异常");
            }
        })

    });

    loadData();

    function loadData(){

        $.ajax({
            url:'/api/know/start',
            success:function(res){
                if(res && res.code == 404){
                    layer.msg("加载树数据失败或数据库没有数据");
                }else{
                    //把data 转成树结构
                    let treeData = covertData2Tree(res.data,0);
                    renderTree(treeData);
                }
            },
            error:function(){
                layer.msg('加载树数据异常');
            }
        });
    }

    function covertData2Tree(listData,parentId){
        let treeList = [];
        if(listData.length>0){
            for(let key in listData){
                let item = listData[key];
                if(parentId == item.parentId){
                    //listData.splice(key,1);  //为了速度（性能），从原数组中删除掉已经找到过的元素
                    let children = covertData2Tree(listData,item.id);
                    if(children.length>0){
                        item.children = children;
                    }
                    treeList.push(item);
                }
            }
        }
        return treeList;
    }

    // 显示（渲染）树结构DOM
    function renderTree(data) {
        //渲染
        var inst1 = tree.render({
            elem: '#MyTree'  //绑定元素
            ,data: data
            ,id: 'demoId'
            ,edit: ['add', 'update', 'del'] //操作节点的图标
            ,click: function(obj){
                $("input[name='id']").val(obj.data.id);
                $("input[name='head']").val(obj.data.head);
                $("#LAY_demo1").val(obj.data.content);
                index = layedit.build('LAY_demo1');
                // console.log(obj.data); //得到当前点击的节点数据
                // console.log(obj.state); //得到当前节点的展开状态：open、close、normal
                // console.log(obj.elem); //得到当前节点元素
                //
                // console.log(obj.data.children); //当前节点下是否有子节点


                // let topValue = $(obj.elem).offset().top;
                // console.log(topValue);
                // $('#fff').css('top',topValue-156-(window.innerHeight/2));
            }
            ,operate: function(obj){
                var type = obj.type; //得到操作类型：add、edit、del
                var data = obj.data; //得到当前节点的数据
                var elem = obj.elem; //得到当前节点元素

                console.log("type："+JSON.stringify(type));
                console.log("data："+JSON.stringify(data));
                console.log("elem："+JSON.stringify(elem));

                //Ajax 操作
                var id = data.id; //得到节点索引
                if(type === 'add'){ //增加节点
                    add(id);

                } else if(type === 'update'){ //修改节点

                    // console.log("修改："+data.title);
                    update(data);


                } else if(type === 'del'){ //删除节点
                    let shuzu = [];

                    digui(data);
                    function digui(data){
                        if(!data.children){
                            shuzu.push(data.id);
                        }else{
                            shuzu.push(data.id);
                            data=data.children;
                            for(let key in data){
                                digui(data[key]);
                            }
                        }
                    }

                    del(shuzu);

                }
            }
        });
    }


    function add(parentId){
        //layer.msg(parentId)
        $.ajax({
            url:'/api/know/add',
            data:{parentId:parentId},
            success:function(res){
                if(res && res.code == 200){
                    loadData();
                    layer.msg("增加节点成功")

                }else{
                    loadData();
                    layer.msg("增加节点失败")
                }
            },
            error:function(){
                loadData();
                layer.msg('增加节点异常');
            }
        });
    }

    // {id   parentId  title describe content }
    function update(data){
        $.ajax({
            url:'/api/know/update',
            data:data,
            success:function(res){
                if(res && res.code == 500){
                    layer.msg("修改失败")

                }else{
                    layer.msg("修改成功")
                    loadData();
                }
            },
            error:function(){
                layer.msg('修改异常');
            }
        });


    }

    /**
     * 删除节点（可多个）
     * @param shuzu 节点id数组，如 [1,2,4,5,9]
     */
    function del(shuzu){
        $.ajax({
            url:'/api/know/dels',
            data: {ids:shuzu},
            success:function(res){
                if(res && res.code == 500){
                    loadData();
                    layer.msg(res.msg);

                }else{
                    loadData();
                    layer.msg('删除成功');


                }
            },
            error:function(){
                loadData();
                layer.msg('删除异常');
            }
        });
    }

    // //开启节点操作图标
    // tree.render({
    //     elem: '#test9'
    //     ,data: data1
    //     ,edit: ['add', 'update', 'del'] //操作节点的图标
    //     ,click: function(obj){
    //         layer.msg(JSON.stringify(obj.data));
    //     }
    //
    //     ,operate: function(obj){
    //         var type = obj.type; //得到操作类型：add、edit、del
    //         var data = obj.data; //得到当前节点的数据
    //         var elem = obj.elem; //得到当前节点元素
    //
    //         //Ajax 操作
    //         var id = data.id; //得到节点索引
    //         if(type === 'add'){ //增加节点
    //             //返回 key 值
    //             return 123;
    //         } else if(type === 'update'){ //修改节点
    //             console.log(elem.find('.layui-tree-txt').html()); //得到修改后的内容
    //         } else if(type === 'del'){ //删除节点
    //
    //         };
    //     }
    // });

    //
    // //构建一个默认的编辑器
    // let index;
    //
    // $.ajax({
    //     url:'/api/tech/show',
    //     success:function(res){
    //         console.log(JSON.stringify(res));
    //
    //
    //         // res = ResponseResult
    //         if(res && res.code == 404){
    //             index = layedit.build('LAY_demo1');
    //             layer.msg("富文本里没显示内容的原因：没有保存有或读取失败");
    //
    //         }else{
    //             $("#LAY_demo1").val(res.data);
    //             index = layedit.build('LAY_demo1');
    //             layer.msg("显示富文本内容成功");
    //         }
    //
    //     },
    //     error:function(){
    //
    //         layer.msg("显示富文本内容异常");
    //     }
    // })
    //
    //
});