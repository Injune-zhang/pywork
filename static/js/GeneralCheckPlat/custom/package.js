function upload_package(files) {
    $("#uploadTips").html("正在上传，请稍候");
	//var files = $('#packageFile')[0].files;
    var filenums = files.length;
    project_name=$("#projectCurName").val();
    
    $("#uploadTips").html("正在更新数据，请稍候");
    var day = prompt("请输入map的日期，形如：20180101", "");
    while (day != null && day != "" && (day.length != 8 || isNaN(day))) {
        day = prompt("日期格式错误，请重新输入map的日期，形如：20180101", "");
    }
    var size = prompt("请输入包体大小,单位MB，形如：605","");
        while (isNaN(size)){
            size = prompt("请输入包体大小,单位MB，形如：605","");
        }
    if (day != null && day != ""&& size != null && size != "") {
    	var form = new FormData();
    	for (var i = 0; i < filenums; i++){
    		form.append('files',files[i]);
    	};
		form.append('day',day);
		form.append('project_name',project_name);
		form.append('size',size);
        $.ajax({
            url:'uploadPackage',
            type:'POST',
            data:form,
            processData:false,   //设置不对数据进行自处理，默认jquery会对上传的数据进行处理
            contentType:false,//"application/x-www-form-urlencode",   //设置不添加请求头的内容类型
            success:function (ret) {
                $("#packageData").html(ret);
                $("#dateSelect").multiselect({     //设置下拉多选框格式
					noneSelectedText: "请选择", 
					checkAllText: "全选", 
					uncheckAllText: '全不选', 
					selectedText: '# 被选择',
				}); 
                $("#uploadTips").html("");
                var packagepercentList=JSON.parse($("#percentData").val());
                loadPercent(packagepercentList);
                var pacageTrend=JSON.parse($("#trendData").val());  //添加数据时，更新趋势
				loadTrend(pacageTrend);
            }
    	});
    }
    else {
        $("#uploadTips").html("");
    }
}

function deleteData(ob) {
    var day = $(ob).attr("id");
    project_name=$("#projectCurName").val();
    var isDelete = confirm("确认删除数据" + day + "?");
    if (isDelete) {
        $("#uploadTips").html("正在更新数据");
        $.get("deleteDate", {'day': day,'project_name':project_name}, function (ret) {
            $("#packageData").html(ret);
            $("#dateSelect").multiselect({     //设置下拉多选框格式
				noneSelectedText: "请选择", 
				checkAllText: "全选", 
				uncheckAllText: '全不选', 
				selectedText: '# 被选择',
			});
            $("#uploadTips").html("");
            var packagepercentList=JSON.parse($("#percentData").val());
            loadPercent(packagepercentList);
        });
    }
    else {
        $("#uplodaTips").html("");
    }


}

function selectData(){
	var dateList=$("#dateSelect").multiselect("MyValues").split("+"); 
	if(dateList=="" || dateList.length<1){alert("尚未选择日期");} 
	else if(dateList.length>3){alert("最多选择三项");}
	else{
		project_name=$("#projectCurName").val();
        $.get("selectDate", {'dateList': JSON.stringify(dateList),'project_name':project_name}, function (ret) {
            $("#packageData").html(ret);
			$("#dateSelect").multiselect({     //设置下拉多选框格式
						noneSelectedText: "请选择", 
						checkAllText: "全选", 
						uncheckAllText: '全不选', 
						selectedText: '# 被选择',
			}); 
            var packagepercentList=JSON.parse($("#percentData").val());
            loadPercent(packagepercentList);
        });		
	}
}

function clearData(){
	project_name=$("#projectCurName").val();
	var isSure = confirm("确认删除全部数据？");
	if(isSure){
	    $.get("clearDate", {'project_name':project_name}, function (ret) {
	        $("#packageData").html(ret);
			$("#dateSelect").multiselect({     //设置下拉多选框格式
						noneSelectedText: "请选择", 
						checkAllText: "全选", 
						uncheckAllText: '全不选', 
						selectedText: '# 被选择',
			}); 
	        var packagepercentList=JSON.parse($("#percentData").val());
	        loadPercent(packagepercentList);
            loadPercent(packagepercentList);
	    });			
	}

}

function changeData(){
	project_name=$("#projectCurName").val();
	var isSure = confirm("确认转换全部数据？");
	if(isSure){
	    $.get("changeDate", {'project_name':project_name}, function (ret) {
	        $("#packageData").html(ret);
			$("#dateSelect").multiselect({     //设置下拉多选框格式
						noneSelectedText: "请选择", 
						checkAllText: "全选", 
						uncheckAllText: '全不选', 
						selectedText: '# 被选择',
			}); 
	        var packagepercentList=JSON.parse($("#percentData").val());
	        loadPercent(packagepercentList);
            loadPercent(packagepercentList);
	    });			
	}

}

function handleFileDragEnter(e) {
    //不再派发事件
    e.stopPropagation();
    //取消事件的默认动作
    e.preventDefault();
    //为当前元素添加CSS样式（这里使用到的样式均会在下面展示出来）
    this.classList.add('hovering');
}

//文件离开事件
function handleFileDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    //为当前元素移除CSS样式
    this.classList.remove('hovering');
}

//文件拖拽完成效果
function handleFileDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    //把拖动的元素复制到放置目标（注1会给出dropEffect详细属性）。
    e.dataTransfer.dropEffect = 'copy';
}

//文件拖拽到页面后处理方式
function handleFileDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    //为当前元素移除CSS样式
    this.classList.remove('hovering');
    var files = e.dataTransfer.files;
    //根据files[]获得的数据，在前台页面写出上传的文件基本信息
    var outputStr = [];
    for (var i = 0, f; f = files[i]; i++) {
        var lastModified = f.lastModifiedDate;
        var lastModifiedStr = lastModified ? lastModified.toLocaleDateString() + ' ' + lastModified.toLocaleTimeString()
            : 'n/a';
        outputStr += '<li><strong>' + f.name + '</strong></li>';
    }
    $("#output_area").innerHTML = '<ul>' + outputStr + '</ul>';
    //target 事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口。
        var files = e.target.files || e.dataTransfer.files;
        upload_package(files);
}

//var fd = new FormData();
$(document).ready(function (){
$("#dateSelect").multiselect({     //设置下拉多选框格式
			noneSelectedText: "请选择", 
			checkAllText: "全选", 
			uncheckAllText: '全不选', 
			selectedText: '# 被选择',
		}); 
var output = document.getElementById('output_area');
var dropZone = document.getElementById('drop_zone');
//为四种方法生成addEventListener事件监听器，addEventListener有三个参数：第一个参数表示事件名称；第二个参数表示要接收事件处理的函数；第三个参数为 useCapture（一般来说为false，true会更改响应顺序），
dropZone.addEventListener('dragenter', handleFileDragEnter, false);
dropZone.addEventListener('dragleave', handleFileDragLeave, false);
dropZone.addEventListener('dragover', handleFileDragOver, false);
dropZone.addEventListener('drop', handleFileDrop, false);

var packagepercentList=JSON.parse($("#percentData").val());
loadPercent(packagepercentList);
var pacageTrend=JSON.parse($("#trendData").val());
loadTrend(pacageTrend);

});

function loadPercent(packagepercentList)  {
    $("#percent_0").html('');
    $("#percent_1").html('');
    $("#percent_2").html('');
    for(i=0;i<packagepercentList.length;i++){
        loadPieEcharts("percent_"+i,packagepercentList[i]);
    }
}

//画资源占比的饼图
function loadPieEcharts(pid_id,ret){
	 var PieChart = echarts.init(document.getElementById(pid_id));
	 var option = {
    title: {
        text: ret.date,
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    },

    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    series : [
        {
            name:'',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:ret.data,//.sort(function (a, b) { return a.value - b.value; }),
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
            }
        }
    ]
};
        // 使用刚指定的配置项和数据显示图表。
        PieChart.setOption(option);
}


function loadTrend(pacageTrend){
    $("#percent_trend").html("");
    loadStackEcharts("percent_trend",pacageTrend);
}

//画趋势堆积图
function loadStackEcharts(stack_id,ret){
    var StackChart = echarts.init(document.getElementById(stack_id));
    var option = {
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:ret.reskindList
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ret.dateList
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : ret.trendSeries
};
    // 使用刚指定的配置项和数据显示图表。
        StackChart.setOption(option);
}

//function selectradio(flag){
//    if (flag == 1) {
//        document.getElementById('c1table').style.display = "table";
//        document.getElementById('c2table').style.display = "none";
//        document.getElementById('c1pg').style.display = "inline";
//        document.getElementById('c2pg').style.display = "none";
//        document.getElementById('c3table').style.display = "none";
//        document.getElementById('c4table').style.display = "none";
//    }
//    else if (flag == 2){
//        document.getElementById('c1table').style.display = "none";
//        document.getElementById('c2table').style.display = "table";
//        document.getElementById('c1pg').style.display = "none";
//        document.getElementById('c2pg').style.display = "inline";
//        document.getElementById('c3table').style.display = "none";
//        document.getElementById('c4table').style.display = "none";
//    }
//    else if (flag == 3){
//        document.getElementById('c1table').style.display = "none";
//        document.getElementById('c2table').style.display = "none";
//        document.getElementById('c3table').style.display = "table";
//        document.getElementById('c4table').style.display = "none";
//    }
//    else if (flag == 4){
//        document.getElementById('c1table').style.display = "none";
//        document.getElementById('c2table').style.display = "none";
//        document.getElementById('c3table').style.display = "none";
//        document.getElementById('c4table').style.display = "table";
//    }
//    else{
//        alert("Something Wrong?[1]");
//    }
//
//}

function selectradio(){
    var radio1 = document.getElementsByName('showtype');
    var radio2 = document.getElementsByName('compresstype');
    var showtype;
    var compresstype;
    var pacageTrend;
    var packagepercentList;
    for(i=0;i<radio1.length;i++){
        if(radio1[i].checked){
            showtype = radio1[i].value;
        }
    }
    for(i=0;i<radio2.length;i++){
        if(radio2[i].checked){
            compresstype = radio2[i].value;
        }
    }
    if (showtype == 1 && compresstype == 3){
        document.getElementById('c1table').style.display = "table";
        document.getElementById('c2table').style.display = "none";
        document.getElementById('c1pg').style.display = "inline";
        document.getElementById('c2pg').style.display = "none";
        document.getElementById('c3table').style.display = "none";
        document.getElementById('c4table').style.display = "none";
        pacageTrend=JSON.parse($("#trendData").val());
        packagepercentList=JSON.parse($("#percentData").val());
;

    }
    else if (showtype == 2 && compresstype == 3){
        document.getElementById('c1table').style.display = "none";
        document.getElementById('c2table').style.display = "table";
        document.getElementById('c1pg').style.display = "none";
        document.getElementById('c2pg').style.display = "inline";
        document.getElementById('c3table').style.display = "none";
        document.getElementById('c4table').style.display = "none";
        pacageTrend=JSON.parse($("#trendData").val());
        packagepercentList=JSON.parse($("#percentData").val());
    }
    else if (showtype == 1 && compresstype == 4){
        document.getElementById('c1table').style.display = "none";
        document.getElementById('c2table').style.display = "none";
        document.getElementById('c1pg').style.display = "inline";
        document.getElementById('c2pg').style.display = "none";
        document.getElementById('c3table').style.display = "table";
        document.getElementById('c4table').style.display = "none";
        pacageTrend=JSON.parse($("#trendData_compress").val());
        packagepercentList=JSON.parse($("#percentData_compress").val());
    }
    else if (showtype == 2 && compresstype == 4){
        document.getElementById('c1table').style.display = "none";
        document.getElementById('c2table').style.display = "none";
        document.getElementById('c1pg').style.display = "none";
        document.getElementById('c2pg').style.display = "inline";
        document.getElementById('c3table').style.display = "none";
        document.getElementById('c4table').style.display = "table";
        pacageTrend=JSON.parse($("#trendData_compress").val());
        packagepercentList=JSON.parse($("#percentData_compress").val());
    }
    else{
        alert("Something Wrong?[2]");
    }
    loadTrend(pacageTrend);
    loadPercent(packagepercentList)
}