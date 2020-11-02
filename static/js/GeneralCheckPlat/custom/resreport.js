function init_calendar(){     //加载时间控件
 	var speciald=eval($("#dayList").val());
 	var defaultdate=$("#inputDay").val();
	$("#resrpt_date").val(defaultdate);
	$(".jqeury_calendar_resrpt").datetimepicker({
			closeOnDateSelect:true,
			format:'Y/m/d',   //必须／的方式，才能识别日期
			beforeShowDay: function( date ) {
                var m=(date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth() + 1);
                var d=date.getDate() < 10 ? "0" + date.getDate() : date.getDate() ;
                var y=date.getFullYear();
                var formatDate=y+"/"+m+"/"+d;//此处日期的格式化和speciald中的格式一样

                //inArray实现数组的匹配
                if($.inArray(formatDate,speciald)!=-1){
                	return [true,"highlight",formatDate];
                	if(formatDate==defaultdate){
                		return [true,'',''];
                	}
                	else{return [true,"highlight",formatDate];}
                    //此处要返回一个数组，specialdays是添加样式的类

                }
                else{
                    return [true,'',''];
                }
          },
          defaultDate:defaultdate,
	});
}

$(document).ready(function(){
	init_calendar();
	var output = document.getElementById('output_area');
	var dropZone = document.getElementById('drop_zone');
	//为四种方法生成addEventListener事件监听器，addEventListener有三个参数：第一个参数表示事件名称；第二个参数表示要接收事件处理的函数；第三个参数为 useCapture（一般来说为false，true会更改响应顺序），
	dropZone.addEventListener('dragenter', handleFileDragEnter, false);
	dropZone.addEventListener('dragleave', handleFileDragLeave, false);
	dropZone.addEventListener('dragover', handleFileDragOver, false);
	dropZone.addEventListener('drop', handleFileDrop, false);

});

function change_day(){             //更改日期时触发
	var newday=$("#resrpt_date").val();
	var speciald=eval($("#dayList").val());
	if($.inArray(newday,speciald)!=-1){   //有报告的日期，才会刷新页面
		$("#invalid_date").hide();
		var project_name=$("#projectCurName").val();
		var input_day=newday;
		var func_id=$("#changefunc ul:first").children(".current-page").attr("id");
		location.href="chooseRptDay?project_name="+project_name+"&func_id="+func_id+"&input_day="+input_day;
	}
	else{$("#invalid_date").show();}

}


$(document).on('click','#add',function(){   //生成某日期报告的概述
	var input_day=prompt("请输入需要生成概述的报告日期，形如：2018-05-01", "");
    while (input_day != null && input_day != ""&& input_day.length != 10 ) {
        inputday = prompt("日期格式错误，请重新输入，形如：2018-05-01", "");
    }
    if (input_day != null && input_day != ""&& input_day.length == 10){
		var project_name=$("#projectCurName").val();
		$.get('add_summarydata', {'project_name':project_name,"input_day":input_day}, function(ret){
			if(ret=='success'){
				var func_id=$("#changefunc ul:first").children(".current-page").attr("id");
				location.href="chooseRptDay?project_name="+project_name+"&func_id="+func_id+"&input_day="+input_day;
			}

		},'text');
	}

});

$(document).on('click','#del',function(){   //删除某日期的整个报告
	var input_day=prompt("请输入需要删除的报告日期，形如：2018-05-01", "");
    while (input_day != null && input_day != ""&& input_day.length != 10 ) {
        inputday = prompt("日期格式错误，请重新输入，形如：2018-05-01", "");
    };
    if (input_day != null && input_day != ""&& input_day.length == 10){
		var project_name=$("#projectCurName").val();
		$.get('del_rptdata', {'project_name':project_name,"input_day":input_day}, function(ret){
			alert(ret);
		},'text');
	};

});

$(document).on('click','#heat',function(){   //统计某日期的热力图超标
	var input_day=$("#inputDay").val();
    if (input_day != null && input_day != ""&& input_day.length == 10){
		var project_name=$("#projectCurName").val();
		$.get('cal_heatmap', {'project_name':project_name,"input_day":input_day}, function(ret){
			if(ret=='success'){
				var func_id=$("#changefunc ul:first").children(".current-page").attr("id");
				location.href="chooseRptDay?project_name="+project_name+"&func_id="+func_id+"&input_day="+input_day;
			}
		},'text');
	}
	else{alert("统计热力图的日期出错！统计失败");}

});

$(document).on('click','.resrpt_cate',function(){    //切换分页
	var cate=$(this).attr("id").split("_")[1];
	if(cate=="uiopen"){$("#ui_echartsdiv").show();}
	else{$("#ui_echartsdiv").hide();}
	if(cate=="summary" || $("#"+cate).html()== null || $("#"+cate).html().length == 0){   //如果切换到概述，或者没有被加载过则请求数据
		var project_name=$("#projectCurName").val();
		var inputDay=$("#inputDay").val();
		$.get('changeRptSheet', {'project_name':project_name,'sheet_name':cate,'input_day':inputDay }, function(ret){
			$("#"+cate).html(ret);
			if(cate=="uiopen"){
				$("#ui_echartsdiv").show();
				var ui_data=JSON.parse($("#ui_data").val());
					load_UIopen(ui_data);

			}
			if(cate=="sceneheatmap"){  //异步加载热力图
				setTimeout(function () {
//					$("#test").html('<img src="/GeneralCheckPlat/static/img/GeneralCheckPlat/moshengzhizhan.bmp" style="height: 200px;position:absolute;left:0px;top:0px; ">')
					$(".heatmap_name").each(function(){
						var heatmap_id=$(this).attr("id");
						$.get('getHeatData',{'heatmap_id':heatmap_id,'project_name':project_name},function(ret){
							var heatmap_id2="echart_"+heatmap_id;
							heatmap_draw(ret,heatmap_id2);
						});
					});
    			}, 500);


			}
		},'text');
	}

	//画热力图
function heatmap_draw(ret,heatmap_id){
    	ret=jQuery.parseJSON(ret);
        if(ret.heatmapDatas==''){$("#"+heatmap_id).html("没有获取到数据");$("#"+heatmap_id).css('font-size',17);return;}
        $("#"+heatmap_id).html(sceneimg_position(ret.scaleconf));
    	heatmapInstance = {
        my_chart: null,
        init: function(ret) {
            var config = {
                container: document.getElementById(heatmap_id),
                radius: ret.scaleconf.radius-1,
                maxOpacity: 0.8,
                minOpacity: 0.2,
                blur: 0.65,
            };
            this.my_chart = h337.create(config);
        },
        draw: function(ret) {
            var pro_data = {
	          min: ret.scaleconf.color_value[0],
		   	  max: ret.scaleconf.color_value[1],
              data:ret.heatmapDatas,
            };
            this.my_chart.setData(pro_data);
        },
    };
    heatmapInstance.init(ret);
    heatmapInstance.draw(ret);
	}

//获取热力图的背景图
function sceneimg_position(scaleconf){
	var imgpath="";
	if(scaleconf["img"]!=''){imgpath='/static/img/GenralCheckPlat/'+scaleconf["img"];}
	return '<img src="'+imgpath+'" style="height: '+scaleconf["height"]+'px;position:absolute;left:'+scaleconf["left"]+'px;top:'+scaleconf["top"]+'px; ">';
}

	//特效、UI响应需要有上传功能
	if(cate=='sfx'){
		$("#upload_cate").html("上传特效overdraw截图");
		$("#upload_div").show();
	}
	else if(cate=='uiopen'){
		$("#upload_cate").html("上传UI响应数据（log.txt）");
		$("#upload_div").show();
	}
	else{
		$("#upload_div").hide();
	}
});


$(document).on('click','.sub_cate',function(){     //点击切换各分页下的条目
	var res_id=$(this).attr("id");
	if($("#tab_"+res_id).html().indexOf("div")==-1){   //如果没有被加载过则请求数据
		var project_name=$("#projectCurName").val();
		var inputDay=$("#inputDay").val();
		var changeItem="";
		if(res_id.indexOf("sfx")>=0){changeItem='changeSfxItem';}
		else if(res_id.indexOf("model")>=0){changeItem='changeModelItem';}
		else if(res_id.indexOf("scene")>=0){changeItem='changeSceneItem';}
		$.get(changeItem, {'project_name':project_name,'res_item':res_id,'input_day':inputDay }, function(ret){
			$("#tab_"+res_id).html(ret);
		},'text');
	}
	$(this).parent().parent().find(".sub_cate").removeAttr("style");   //专门设置下标签的颜色
	$(this).css("background","#97d6e6");
});

$(document).on('click','.btn_sfxoverdraw_rename',function(){  //重命名特效overdraw截图
	var picture_newname = prompt("请重命名截图的场景和特效，形如：讳剑山庄-瀑布。", "");
	if(picture_newname){
		var picture_oldname=$(this).attr("id").split("btn_sfxoverdraw_rename_")[1];
		var inputDay=$("#inputDay").val();
		var project_name=$("#projectCurName").val();
		$.get('renameSfxOverdraw',{'picture_newname':picture_newname,'picture_oldname':picture_oldname,'inputDay':inputDay,'project_name':project_name},function(ret){
			if(ret=="fail"){alert("重命名失败，请检查原截图是否存在。");}
			else if(ret=="repeat"){alert("重命名失败，请检查新命名是否已重复。");}
			else{$("#tab_sfxoverdraw").html(ret);}

		});
	}
	else{alert("命名无效！");}

});

$(document).on('click','.btn_sfxoverdraw_del',function(){  //删除特效overdraw截图
	if(confirm("确认删除该截图吗？")==true){
		var picture=$(this).attr("id").split("btn_sfxoverdraw_del_")[1];
		var inputDay=$("#inputDay").val();
		var project_name=$("#projectCurName").val();
		$.get('delOneSfxOverdraw',{'picture':picture,'inputDay':inputDay,'project_name':project_name},function(ret){
			$("#tab_sfxoverdraw").html(ret);
		});
	}

});


function load_UIopen(ui_data){  //显示ui响应图
	var barChart = echarts.init(document.getElementById("ui_echarts"));
	option = {
	    color: ['#003366', '#4cabce', ],
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
			data: ['总时间', '初始化时间',],
	    },
	    toolbox: {
	        show: true,
	        orient: 'vertical',
	        left: 'right',
	        top: 'center',
	        feature: {
	            mark: {show: true},
	            dataView: {show: true, readOnly: false},
	            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
	            restore: {show: true},
	            saveAsImage: {show: true}
	        }
	    },
	    calculable: true,
	    xAxis: [
	        {
	            type: 'category',
	            axisTick: {show: false},
			    axisLabel:{  
		            interval: 0  ,
		            rotate:15,
		        }, 
	            data: ui_data.uiName,
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value'
	        }
	    ],
	    series: [
	        {
	            name: '总时间',
	            type: 'bar',
	            barGap: 0,
	            data: ui_data.totalTime,
	        },
	        {
	            name: '初始化时间',
	            type: 'bar',
	            data: ui_data.otherTime,
	        },
	
	    ]
	};

	barChart.setOption(option);
}

function upload_resRpt(files) {     //上传
    $("#uploadTips").html("正在上传，请稍候");
    var filenums = files.length;
    var project_name=$("#projectCurName").val();
    var inputDay=$("#inputDay").val();
    cate=$("#resrpt_ul li.active:first a").attr("id").split("_")[1];
    $("#uploadTips").html("正在更新数据，请稍候");
    if(cate=="sfx"){    //上传特效overdraw截图
		var picture_name = prompt("请描述截图的场景和特效，形如：讳剑山庄-瀑布。\n多个截图请用英文分号';'隔开。", "");
		if(picture_name){
			namelist=picture_name.split(";");
			if(namelist.length!=filenums){
				alert("描述的截图个数与上传截图数不等，请重新选择上传！");
				$("#uploadTips").html("");
			}//判断描述是否与截图文件个数相等
			else{
				var form = new FormData();
				for (var i = 0; i < filenums; i++){
					form.append('files',files[i]);
				};
				form.append('project_name',project_name);
				form.append('filenames',picture_name);
				form.append('input_day',inputDay);
				$.ajax({
					url:'uploadSfxOverdraw',
					type:'POST',
					data:form,
					processData:false,   //设置不对数据进行自处理，默认jquery会对上传的数据进行处理
					contentType:false,//"application/x-www-form-urlencode",   //设置不添加请求头的内容类型
					success:function (ret) {
						if(ret=="fail"){alert("上传失败，可能存在遗漏命名的截图")}
						else{
							$("#tab_sfxoverdraw").html(ret);
							$("#uploadTips").html("");
						}

					}
				});
			}
		}
		else{  //选择取消键
			$("#uploadTips").html("");
		}
	}
	else if(cate=="uiopen"){  //上传ui响应数据
		var machine_name = prompt("请输入测试机型，例如：华为Mate9", "");
		if(machine_name){
			var form = new FormData();
			for (var i = 0; i < filenums; i++){
				form.append('files',files[i]);
			};
			form.append('project_name',project_name);
			form.append('machine_name',machine_name);
			form.append('input_day',inputDay);
			$.ajax({
				url:'uploadUIOpen',
				type:'POST',
				data:form,
				processData:false,   //设置不对数据进行自处理，默认jquery会对上传的数据进行处理
				contentType:false,//"application/x-www-form-urlencode",   //设置不添加请求头的内容类型
				success:function (ret) {
					$("#uploadTips").html("");
					$("#uiopen").html(ret);
					var ui_data=JSON.parse($("#ui_data").val());
					load_UIopen(ui_data);
				}
			});
		}
		else{  //选择取消键
			$("#uploadTips").html("");
		}
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
        upload_resRpt(files);
}