//接收rpc的统计
var chart1
//发送rpc的统计
var chart2
var chart3
var charts
var chart1_data=[]
var chart2_data=[]
var chart3_data=[]
var charts_data=[chart1_data,chart2_data]

var legend1_data=[]
var legend2_data=[]
var legends=[legend1_data,legend2_data]
var chart1_option = {
    title : {
        text: '接收rpc',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // legend: {
        // orient: 'vertical',
        // left: 'left',
        // data: legend1_data,
    // },
    series : [
        {
            name: '接收rpc:次数',
            type: 'pie',
            radius : '80%',
            center: ['50%', '52%'],
            avoidLabelOverlap: true,
            data:chart1_data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            },
            // label: {
                // normal: {
                    // textStyle:{color:'#000',fontSize:10,},
                    // position: 'inner'
                // }
            // },
            // labelLine: {
                // normal: {
                    // show: false
                // }
            // },
            label: {
                normal: {
                    show: false,
                    },
                emphasis: {
                    show: false,
            }
            },
            labelLine: {
                normal: {
                    show: false
                        },
                emphasis: {
                    show: false,
                    }
            },
        }
    ]
};

var chart2_option = {
    title : {
        text: '发送rpc',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // legend: {
        // orient: 'vertical',
        // left: 'left',
        // data: legend2_data,
    // },
    series : [
        {
            name: '发送rpc:次数',
            type: 'pie',
            radius : '80%',
            center: ['50%', '52%'],
            avoidLabelOverlap: true,
            data:chart2_data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            },
            // label: {
                // normal: {
                    // textStyle:{color:'#000',fontSize:10,},
                    // position: 'inner'
                // }
            // },
            // labelLine: {
                // normal: {
                    // show: false
                // }
            // },
            label: {
                normal: {
                    show: false,
                    },
                emphasis: {
                    show: false,
            }
            },
            labelLine: {
                normal: {
                    show: false
                        },
                emphasis: {
                    show: false,
                    }
            },
            
        }
    ]
};


var chart3_option = {
    title : {
        text: '值分布',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // legend: {
        // orient: 'vertical',
        // left: 'left',
        // data: legend2_data,
    // },
    series : [
        {
            name: '值:次数',
            type: 'pie',
            radius : '60%',
            center: ['50%', '50%'],
            data:chart3_data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            },
            // label: {
                // normal: {
                    // show: false,
                    // },
                // emphasis: {
                    // show: false,
            // }
            // },
            // labelLine: {
                // normal: {
                    // show: false
                        // },
                // emphasis: {
                    // show: false,
                    // }
            // },
            
        }
    ]
};

var charts_option=[chart1_option,chart2_option]

function chart_addData(name,n){
    console.log(name)
    console.log(charts)
    chart=charts[n-1]
    c_data=charts_data[n-1]
    for(var i=0;i<c_data.length;i++){
        if(c_data[i].name==name){
            c_data[i].value+=1
            chart.setOption(charts_option[n-1])
            return
        }
    
    }
    legends[n-1].push(name)
    c_data.push({value:1,name:name})
    chart.setOption(charts_option[n-1])
}
function c_init(){
        chart1=echarts.init(document.getElementById('chart1'));
        chart1.setOption(chart1_option)
        chart2=echarts.init(document.getElementById('chart2'));
        chart2.setOption(chart2_option)
        charts=[chart1,chart2]
        
        chart1.on('click',function(param){viewmoreinfo(allinfo_rec[param.name],param.name)})
        chart2.on('click',function(param){viewmoreinfo(allinfo_send[param.name],param.name)})
        
        chart3=echarts.init(document.getElementById('chart3'));
        chart3.setOption(chart3_option)
}

function setChart3data(data){

    chart3_data.splice(0,chart3_data.length)
    _data=JSON.parse(data)
    for(var i in _data){
        chart3_data.push({name:i,value:_data[i]})
    
    }
    chart3.setOption(chart3_option)
}

function clearcharts(){
    chart1_data.splice(0,chart1_data.length)
    chart2_data.splice(0,chart2_data.length)
    chart1.setOption(chart1_option)
    chart2.setOption(chart2_option)
    
    allinfo_send={}
    allinfo_rec={}
    
    $('#moreinfo').parent().hide()
}


function viewmoreinfo(info,rpcname){

    chart3_data.splice(0,chart3_data.length)
    chart3.setOption(chart3_option)
$('#moreinfo').html('')
d=$('<div></div>').appendTo($('#moreinfo'))
$('<div class="txtc"></div>').html(rpcname).appendTo(d)
for(kpath in info){
    _d=$('<div class="row" ></div>').appendTo(d)
    _d.attr('data',JSON.stringify(info[kpath]))
    _d.click(function(){
        $('#moreinfo .row').removeClass('on')
        $(this).addClass('on')
        setChart3data($(this).attr('data'))
    
    })
    $('<div class="path"></div>').html(kpath).appendTo(_d)
    $('<div class="count"></div>').html(Object.keys(info[kpath]).length).appendTo(_d)

}
$('#moreinfo').parent().show()
}
allinfo_send={}
allinfo_rec={}
//rpcname字符串
//统计send
function addpathvalue_send(rpcname,o,p=''){
    if(!(rpcname in allinfo_send)){
        allinfo_send[rpcname]={}
    }

    if(typeof(o)=="object"){
        for(var i in o){
            addpathvalue_send(rpcname,o[i],p+'/'+i)
        }
    }
    else{
        if(!(p in allinfo_send[rpcname])){
            allinfo_send[rpcname][p]={}
        }
        if(o in allinfo_send[rpcname][p]){
            allinfo_send[rpcname][p][o]+=1
        }
        else{
            allinfo_send[rpcname][p][o]=1
        }
    }

}

//统计rec
function addpathvalue_rec(rpcname,o,p=''){
    if(!(rpcname in allinfo_rec)){
        allinfo_rec[rpcname]={}
    }

    if(typeof(o)=="object"){
        for(var i in o){
            addpathvalue_rec(rpcname,o[i],p+'/'+i)
        }
    }
    else{
        if(!(p in allinfo_rec[rpcname])){
            allinfo_rec[rpcname][p]={}
        }
        if(o in allinfo_rec[rpcname][p]){
            allinfo_rec[rpcname][p][o]+=1
        }
        else{
            allinfo_rec[rpcname][p][o]=1
        }
    }

}