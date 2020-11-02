var wsselect
$(document).ready(function() {
    //选择框初始化
    wsselect=$('select').niceSelect();
    $('#gamelist').change(function(){startws($('#gamelist').val())})
    //让脚本编辑拖拽
    dragula([document.getElementById('script_container')],{removeOnSpill: true})
    //图表初始化
    c_init()
    //changeToHelp()
    testWS()
    startws()
});


//显示过滤rpc
var filtrpc=[]

//websocket
var ws
//当前的ip端口
var nowIPport=''

//开启ws开始监控
function startws(ipport='localhost:8082'){

    //if(ipport==nowIPport){return}
    if(nowIPport!=''){ws.close();}
    if(ipport=='no'){nowIPport='';return;}

    nowIPport=ipport

    ws=new WebSocket('ws://'+ipport)
    //showretip('连接:'+ipport)
    
    ws.onopen=function(){
        $('#ws_state').css('color','#4CAF50')
        $('<div class="row txtc"></div>').html("连接:"+ipport).appendTo($('#screen .left'))
        toEnd()
    }
    ws.onmessage=function(event){
        dct=JSON.parse(event.data)
        //根据filtrpc过滤显示
        if(filtrpc.indexOf(dct['name'])==-1){
            //根据key添加收取和发送元素
            if(dct['key']==3){
                chart_addData(dct['name'],1)
                addpathvalue_rec(dct['name'],dct['args'])
                if(pause==false){
                    addRec(dct['name'],JSON.stringify(dct['args']),dct['key'])
                    toEnd()
                }
            }
            else if(dct['key']!=3){
                chart_addData(dct['name'],2)
                addpathvalue_send(dct['name'],dct['args'])
                if(pause==false){
                    addSend(dct['name'],JSON.stringify(dct['args']),dct['key'])
                    toEnd()
                }

            }
            

        }

    }
    ws.onclose=function(ev){
        $('#ws_state').css('color','red')
        console.log(ipport)
        if(ev.code==1006){
            // $('#ws_state').css('color','red')
            $('<div class="row txtc"></div>').html("连接失败:"+ev.code).appendTo($('#screen .left'))
            toEnd()
        }
        else if(ev.code==1000){
            //showretip('已关闭')
            $('<div class="row txtc"></div>').html("连接关闭").appendTo($('#screen .left'))
            toEnd()
        }
        else{
            $('<div class="row txtc"></div>').html("连接丢失:"+ev.code).appendTo($('#screen .left'))
            toEnd()
            // showretip('断线了:'+ev.code)
        }
        // setTimeout(function(){
             // start();
        // },3000);
    }
}

//////////////////////////监控显示/////////////////
//是否暂停监控
var pause=false

//清除监控
function clearleft(){
    $('#screen .left').empty()
}

//切换暂停-播放
//pause控制
function play_stop(){
    if(pause){
        pause=false
        $('.fa-play-circle').removeClass('fa-play-circle').addClass('fa-pause-circle')
        console.log(pause)
    }
    else{
        pause=true
        $('.fa-pause-circle').removeClass('fa-pause-circle').addClass('fa-play-circle')
        console.log(pause)
    }
}

//添加收取元素到监控 
//rpcname data参数数据字符串 key方向
function addRec(rpcname,data,key){
    d=$('<div></div>').html("<div class='left_triangle'></div><div class='rec' '>"+rpcname+"</div></div><div class='clearfloat'>")
    d.addClass('row')
    d.attr('data',data)
    d.attr('key',key)
    d.attr('name',rpcname)
    d.click(toEdit)
    d.appendTo($('#screen .left'))

}

//添加发送元素到监控 
//rpcname data参数数据字符串 key方向
function addSend(rpcname,data,key){
    d=$('<div></div>').html("<div class='right_triangle'></div><div class='send'>"+rpcname+"</div></div><div class='clearfloat'>")
    d.addClass('row')
    d.attr('data',data)
    d.attr('key',key)
    d.attr('name',rpcname)
    d.click(toEdit)
    d.appendTo($('#screen .left'))

}

//监控滚动到底 必须先停止动画 
//异步加载页面前必须停止动画 用ismain控制
function toEnd(){
    if(ismain){
        $('#screen .left').stop()
        $('#screen .left').animate({scrollTop: $('#screen .left')[0].scrollHeight});
    }
}

////////////////////////////rpc编辑功能///////////////
//当前编辑中的rpc
var rpc_for_send={'name':'','args':{},'key':0}
//备份修改前的rpc
var orig_rpc

//json编辑器的option设置
//对应全局的rpc_for_send 点属性名打开/收缩 
//number的属性点击 在前方显示编辑集合按钮 传参数path 点击弹窗编辑
opt = { 
        change: function(data) { 
            rpc_for_send['args']=data;
            //脚本编辑的写回
            if($('.onedit').parent().parent().attr('id')=='script'){
                $('.onedit').attr('data',JSON.stringify(data))
            }

            },
        propertyclick: function(path,e) { 
            console.log($(e))
            var item = $(e).parent();
            item.toggleClass('expanded');
            if(item.hasClass('number')){
                $('.rangebt').remove()
                d=$("<div class='rangebt hvr-grow hint--bottom hint--rounded'><i class='fa fa-paw'></i></div>")
                d.attr('path',path)
                d.attr('aria-label',"集合")
                //弹窗编辑范围
                d.click(function(){
                    $('#keyname').html(path)
                    $('#editRange').slideDown()
                })
                d.insertBefore($(e))
             }
            }
        };
//不可编辑属性名
opt.propertyElement = '<input class="property" readonly="readonly">';

//在监控选中的rpc 显示json编辑控件
//使用被点击的元素的属性name、data、key
//数据改变修改rpc_for_send 选中是脚本时写回元素
function toEdit(){

    $('.onedit').removeClass('onedit')
    $(this).addClass('onedit')
    
    rpc_for_send['name']=$(this).attr('name')
    rpc_for_send['args']=JSON.parse($(this).attr('data'));
    rpc_for_send['key']=parseInt($(this).attr('key'))

    $('#btbar').show()
    $('#name').html($(this).attr('name'))
    $('#name').css('display','inline-block')
    var myjson = JSON.parse($(this).attr('data'))
    orig_rpc=myjson

    $('#edit').jsonEditor(myjson, opt);
    resetLock()
    $('#rangebt').hide()
    if(rpc_for_send['key']==3){
        $('#sendbt').hide()
        //突出统计区域
        chart1.dispatchAction({type:'downplay',seriesIndex:0})
        chart2.dispatchAction({type:'downplay',seriesIndex:0})
        chart1.dispatchAction({type:'highlight',name:$(this).attr('name')})
    }
    else if(rpc_for_send['key']!=3){
        $('#sendbt').show()
        //突出统计区域
        chart1.dispatchAction({type:'downplay',seriesIndex:0})
        chart2.dispatchAction({type:'downplay',seriesIndex:0})
        chart2.dispatchAction({type:'highlight',name:$(this).attr('name')})
    }
    
    //apenAll()

}

//从rpc库转到编辑 存rpc_for_send
function toEdit_forRPClist(data){
    rpc_for_send['name']=data['name']
    rpc_for_send['args']=data['args']
    rpc_for_send['key']=data['key']

    $('#btbar').show()
    $('#name').html(data['name'])
    $('#name').css('display','inline-block')
    var myjson = data['args']
    orig_rpc=myjson

    $('#edit').jsonEditor(myjson, opt);
    resetLock()
    $('#rangebt').hide()
    if(rpc_for_send['key']==3){
        $('#sendbt').hide()
    }
    else if(rpc_for_send['key']!=3){
        $('#sendbt').show()
    }
    changeToMain()
}

//使用备份重置json编辑器的数值
function resetRPC(){
    var myjson = orig_rpc
    $('#edit').jsonEditor(myjson, opt);
    resetLock()
    $('#rangebt').hide()
}

//包一下发送
function ws_send(data){
    if(ws!=null && ws.readyState==1){
        console.log(JSON.stringify(data).length)
        ws.send(JSON.stringify(data))
        return true
        }
    else{
        showretip('没有连接')
        return false
    }

}

//指定次数发送rpc_for_send 检查name不是空的 次数大于等于1
function sendRPCnTimes(){
    n=parseInt($('#times').val())
    if(rpc_for_send['name']!='' && n>=1){
        rpc_for_send['times']=n
        console.log(JSON.stringify(rpc_for_send))
        ws_send(rpc_for_send)
    }

}

//指定一个属性的多个范围值 发送多次
//发送后恢复原值
function sendRangeRPC(rpc=rpc_for_send,keypath=$('#keyname').html(),input_range=$('#range').val()){
    //input_range=$('#range').val()
    int_range=strTorange(input_range)
    //keypath=$('#keyname').html()

    _orig=eval("rpc['args']"+keypath)

    for(i in int_range){
        if(rpc['name']!=''){
            eval("rpc['args']"+keypath+"="+int_range[i].toString())
            ws_send(rpc)
        }
    }
    eval("rpc['args']"+keypath+"="+_orig.toString())
}

//json编辑器中节点全部展开 约束只有一个json编辑器
function openAll(){
    $('.object').addClass('expanded')
    $('.array').addClass('expanded')
}

//json编辑器中节点全部收缩 约束只有一个json编辑器
function closeAll(){
    $('.object').removeClass('expanded')
    $('.array').removeClass('expanded')
}

//是否锁住属性名编辑
var isLock=true
//重置属性名的锁
function resetLock(){
    if(isLock==false){
        var d=$('.fa-unlock')
        d.removeClass('fa-unlock')
        d.addClass('fa-lock')
        isLock=true
    }
    $('.object>input.value').hide()
    $('.array>input.value').hide()
}
//根据isLock切换锁的状态
function switchLock(){
    if(isLock){
        var d=$('.fa-lock')
        d.removeClass('fa-lock')
        d.addClass('fa-unlock')
        isLock=false

        $('.object>input.value').show()
        $('.array>input.value').show()
    }
    else{
        var d=$('.fa-unlock')
        d.removeClass('fa-unlock')
        d.addClass('fa-lock')
        isLock=true

        $('.object>input.value').hide()
        $('.array>input.value').hide()
    }
}

/////////////页面切换////////////////////注：监控动画和异步加载会冲突
//是否在主页
var ismain=true
//主页
function changeToMain(){
    $('.toptab').removeClass('ontoptab')
    $('#tomain').addClass('ontoptab')
    $('._tab').hide()
    $('#main').show()
    ismain=true
    toEnd()
}

//rpc库 个人
function changeToRPClist(){
    ismain=false
    $('#screen .left').stop()
    $('.toptab').removeClass('ontoptab')
    $('#torpc').addClass('ontoptab')
    $('._tab').hide()
    $('#_RPClist').load('/rpc_debug/getrpc/')
    $('#RPClist').show()
    $('#openrpc').removeClass('onleftbt')
    $('#selfrpc').addClass('onleftbt')
}

//rpc库 公共
function changeToRPClist_open(){
    ismain=false
    $('#screen .left').stop()
    $('.toptab').removeClass('ontoptab')
    $('#torpc').addClass('ontoptab')
    $('._tab').hide()
    $('#_RPClist').load('/rpc_debug/getrpc/open/')
    $('#RPClist').show()
    $('#selfrpc').removeClass('onleftbt')
    $('#openrpc').addClass('onleftbt')
}

//脚本 自己
function changeToScriptlist(){
    ismain=false
    $('#screen .left').stop()
    $('.toptab').removeClass('ontoptab')
    $('#toscript').addClass('ontoptab')
    $('._tab').hide()
    $('#_Scriptlist').load('/rpc_debug/getscriptlist/')
    $('#Scriptlist').show()
    $('#openscript').removeClass('onleftbt')
    $('#selfscript').addClass('onleftbt')
}

//脚本 公开
function changeToScriptlist_open(){
    ismain=false
    $('#screen .left').stop()
    $('.toptab').removeClass('ontoptab')
    $('#toscript').addClass('ontoptab')
    $('._tab').hide()
    $('#_Scriptlist').load('/getscriptlist/open/')
    $('#Scriptlist').show()
    $('#selfscript').removeClass('onleftbt')
    $('#openscript').addClass('onleftbt')
}

//过滤列表
function changeToFiltlist(){
    ismain=false
    $('#screen .left').stop()
    $('.toptab').removeClass('ontoptab')
    $('#tofilt').addClass('ontoptab')
    $('._tab').hide()
    $('#_Filtlist').load('/rpc_debug/getexclude/')
    $('#Filtlist').show()
}

//使用说明 未完成
function changeToHelp(){
    ismain=false
    $('#screen .left').stop()
    $('.toptab').removeClass('ontoptab')
    $('#tohelp').addClass('ontoptab')
    $('._tab').hide()
    $('#_help').load('/rpc_debug/helpinfo/')
    $('#help').show()

}

//主页-监控
function changeToScreen(){
    $('#toscriptedit').removeClass('onleftbt')
    $('#toscreen').addClass('onleftbt')
    $('#screen').show()
    $('#script').hide()
    toEnd()
}
//主页-脚本
function changeToScriptedit(){

    $('#toscreen').removeClass('onleftbt')
    $('#toscriptedit').addClass('onleftbt')
    $('#screen').hide()
    $('#script').show()
}

//////////////////RPC库/////////////
//增加 默认当前的rpc_for_send
function addToRPClist(realname='realname',isopen=false,rpc=rpc_for_send){
    $.ajax({
      type: 'POST',
      url: '/saverpc/',
      data: {'rpc':JSON.stringify(rpc),'isopen':isopen,'add':true,'realname':realname},
      success: function(re){
        showretip(re)
      },
    });
}
//改变公开属性
function switchRPCisopen(rpc,realname,isopen){
    console.log(isopen)
    $.ajax({
          type: 'POST',
          url: '/saverpc/',
          data: {'rpc':JSON.stringify(rpc),'isopen':isopen,'add':true,'realname':realname},
          success: function(re){
            showretip(re)
          },
    });
}
//删除
function delRPCfromlist(data,realname,e){

    $.ajax({
      type: 'POST',
      url: '/saverpc/',
      data: {'rpc':JSON.stringify(data),'add':false,'realname':realname},
      success: function(re){
        showretip(re)
        if(re=='删除成功'){
            toremove=e.parent().parent()
            toremove.slideUp('300',function(){
                toremove.remove();
            })


        }
      },
    });
}

//////////////////过滤列表/////////////
//增加 默认当前的rpc_for_send的name
function addToFiltlist(rpcname=rpc_for_send['name']){
    $.ajax({
      type: 'POST',
      url: '/rpc_debug/saveexclude/',
      data: {'name':rpcname,'add':true},
      success: function(re){
        showretip(re)
        filtrpc.push(rpcname)
      },
    });
}
//删除
function delFiltfromlist(rpcname,e){
    $.ajax({
      type: 'POST',
      url: '/rpc_debug/saveexclude/',
      data: {'name':rpcname,'add':false},
      success: function(re){
        showretip(re)
        if(re=='删除成功'){
            toremove=e.parent()
            toremove.slideUp(300,function(){
                toremove.remove();
            })
            dx=filtrpc.indexOf(rpcname)
            filtrpc.splice(dx,1)
        }
      },
    });
}

//////////////////////脚本///////////////////
var nowedit_name='未命名脚本'
t=[{"tag":"rpc","rpc":{"name":"apply_buy_goods","args":{"num":1,"goods_id":"7"},"key":0}},{"tag":"rpc","rpc":{"name":"get_equip","args":{"info":[100301001,1003,1]},"key":0}},{"tag":"rpc","rpc":{"name":"do_auto_get_task","args":{"tid_lst":["1000011","1000003"]},"key":0}},{"tag":"rpc","rpc":{"name":"set_level","args":{"lv":10},"key":0}},{"tag":"rpc_range","rpc":{"name":"apply_buy_goods","args":{"num":1,"goods_id":"7"},"key":0},"keypath":"['num']","range":"2-8"}]

//转页面编辑
function openScript(filename){
    //先清空
    $('#script .left .row').remove()

    console.log(filename)
    $.ajax({
          type: 'GET',
          url: '/getscript/'+filename,
          success: function(data){
                console.log(data)
                nowedit_name=filename
                if(JSON.parse(data)['rpc']=='[]'){    
                    changeToMain()
                    changeToScriptedit()
                    showretip('脚本添加了')
                    }
                _data=JSON.parse(JSON.parse(data)['rpc'])

                for(var i=0;i<_data.length;i++){
                    var _line=_data[i]
                    if(_line['tag']=='rpc'){
                        scriptAddRPC(_line['rpc'])

                    }
                    else if(_line['tag']=='rpc_range'){

                        scriptAddRPCrange(_line['keypath'],_line['range'],_line['rpc'])

                    }
                }
          },
    });



}
function addSleep(sec){
    var _rpc={'name':'sleep','args':{'time':parseInt(sec)}}
    scriptAddRPC(_rpc)
}
//加一条rpc元素 跳转回脚本编辑tab
function scriptAddRPC(rpc=rpc_for_send){
    
    d=$('<div></div>').html("<div class='right_triangle'></div><div class='send' '>"+rpc['name']+"</div></div><div class='clearfloat'>")
    d.addClass('row')
    d.attr('data',JSON.stringify(rpc['args']))
    d.attr('key',0)//只允许可以发送的rpc
    d.attr('name',rpc['name'])
    d.attr('tag','rpc')
    // d.click(function(){
        // $('.onedit').removeClass('onedit')
        // $(this).addClass('onedit')
        // toEdit()
    // })
    d.click(toEdit)
    d.appendTo($('#script .left'))
    changeToMain()
    changeToScriptedit()
    showretip('脚本添加了')
}
//加一条批量rpc 跳转回脚本编辑tab range记字符串
function scriptAddRPCrange(keypath=$('#keyname').html(),range=$('#range').val(),rpc=rpc_for_send){
    d=$('<div></div>').html("<div class='right_triangle'></div><div class='send' '>"+rpc['name']+'('+keypath+':'+range+")</div></div><div class='clearfloat'>")
    d.addClass('row')
    d.attr('data',JSON.stringify(rpc['args']))
    d.attr('key',0)
    d.attr('name',rpc['name'])
    d.attr('keypath',keypath)
    d.attr('range',range)
    d.attr('tag','rpc_range')
    d.click(toEdit)
    d.appendTo($('#script .left'))
    changeToMain()
    changeToScriptedit()
    showretip('脚本添加了')

}
//执行脚本 根据页面元素信息
function runScript(times){
    if(ws==null || ws.readyState!=1){
        showretip('没有连接')
        return
    }

    changeToScreen()
    $('<div class="row txtc"></div>').html("执行脚本:"+times+"次").appendTo($('#screen .left'))
    for(var n=0;n<times;n++){

        toEnd()
        var allrow=$('#script_container>.row')
        for(var i=0;i<allrow.length;i++){
            r=allrow[i]
            console.log($(r).attr('tag'))
            if($(r).attr('tag')=='rpc'){
                var temprpc={'name':$(r).attr('name'),'args':JSON.parse($(r).attr('data')),'key':0}
                ws_send(temprpc)
            }
            else if($(r).attr('tag')=='rpc_range'){
                var temprpc={'name':$(r).attr('name'),'args':JSON.parse($(r).attr('data')),'key':0}
                sendRangeRPC(temprpc,$(r).attr('keypath'),$(r).attr('range'))
            }
        }
    
    
    }
}
//新建
function scriptNew(){
$('#script .left .row').remove()

nowedit_name='未命名脚本'
}
//保存
function saveScrip(filename,isopen){
    //转数组
    var script_data=[]
    var allrow=$('#script_container>.row')
    for(var i=0;i<allrow.length;i++){
        r=allrow[i]
        if($(r).attr('tag')=='rpc'){
            var temprpc={'name':$(r).attr('name'),'args':JSON.parse($(r).attr('data')),'key':0}
            script_data.push({'tag':$(r).attr('tag'),'rpc':temprpc})
        }
        else if($(r).attr('tag')=='rpc_range'){
            var temprpc={'name':$(r).attr('name'),'args':JSON.parse($(r).attr('data')),'key':0}
            script_data.push({'tag':$(r).attr('tag'),'rpc':temprpc,'keypath':$(r).attr('keypath'),'range':$(r).attr('range')})
        }
    }
    console.log([filename,isopen])
    console.log(JSON.stringify(script_data))
    $.ajax({
          type: 'POST',
          url: '/savescript/',
          dataType: "json",
          data: {'isopen':isopen,'add':true,'realname':filename,'script_data':JSON.stringify(script_data),},
          success: function(re){
            showretip(re)
          },
    });
}
//删除
function delScriptfromlist(filename,e){
    $.ajax({
          type: 'POST',
          url: '/savescript/',
          dataType: "json",
          data: {'add':false,'realname':filename,},
          success: function(re){
            showretip(re)
            if(re=='删除成功'){
            toremove=e.parent().parent()
            toremove.slideUp(300,function(){
                toremove.remove();
            })
        }
          },
    });

}


///////////////////小函数////////////////////
// function logout(){
    // $.ajax({
          // type: 'GET',
          // url: '/logout/',
          // success: function(data){
            // console.log(data)
          // },
    // });

// }


//显示反馈信息 延迟关闭
function showretip(txt){
    $('#retip').html(txt)
    $('#retip').show(500)
    setTimeout(function(){
             $('#retip').hide(500);
        },1000);
}

//范围转换成数组
function strTorange(str){
    r=[]
    set_0=str.split(',')
    for(i in set_0){
        if(set_0[i]!='undefined'){
            ft=set_0[i].split('-')
            _f=parseInt(ft[0])
            r.push(_f)
            if(ft[1]!= 'undefined'){
                _t=parseInt(ft[1])
                for(i=_f+1;i<=_t;i++){
                r.push(i)
                }

            }
        }
    }
    return r
}

function selectGame(e){
$('#gamelist>div').hide()
e.show()
}

var canlinklist=[]
var lostlinklist=[]
var alllist=[]
function checkWS(){
    var item=alllist.pop()
    if(item!=null){
        var ipport=item["fields"]["addr"]
        var tempws=new WebSocket('ws://'+ipport)
        tempws.onopen=function(){
            canlinklist.push(this.url.replace('ws://','').replace('/',''))
            this.close()
            checkWS()
        }
        tempws.onerror=function(){
            var _ip=this.url.replace('ws://','').replace('/','')
            lostlinklist.push(_ip)
            this.close()
            $('li[data-value="'+_ip+'"]').remove()
            $('option[value="'+_ip+'"]').remove()
            checkWS()
            
        }
                
    }
    else{
        console.log(canlinklist)
        console.log(lostlinklist)
        console.log(alllist)
        $.ajax({
            type: 'POST',
              url: '/deleteopen/',
              data: {'ip':JSON.stringify(lostlinklist)},
              success: function(re){
                //showretip(re)
              },
        });
    }

}
function testWS(){

$.ajax({
          type: 'GET',
          url: '/rpc_debug/refreshlist/',
          success: function(data){
            console.log(data)
            alllist=JSON.parse(data)
            // checkWS()
          },
    });

}