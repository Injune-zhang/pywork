function init_calendar(){
	var speciald=eval($("#dateList").val());
	var defaultdate=$("#now").val();
	var defualtdate2=defaultdate.substr(6,4)+"/"+defaultdate.substr(0,5);
	$(".jqeury_calendar_heatmap").datetimepicker({
			closeOnDateSelect:true,
			format:'m/d/Y',
			defaultDate:defualtdate2,			beforeShowDay: function( date ) {
                var m=(date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth() + 1);
                var d=date.getDate() < 10 ? "0" + date.getDate() : date.getDate() ;
                var y=date.getFullYear();
                var formatDate=m+"/"+d+"/"+y;//此处日期的格式化和speciald中的格式一样
                
                //inArray实现数组的匹配
                if($.inArray(formatDate,speciald)!=-1){
                	return [true,"highlight",formatDate];
                    //此处要返回一个数组，specialdays是添加样式的类
                    
                }
                else{
                    return [true,'',''];
                }
          },
          // onSelectDate:function(e){
                // var m=(e.getMonth()+1) < 10 ? "0" + (e.getMonth()+1) : (e.getMonth() + 1);
                // var d=e.getDate() < 10 ? "0" + e.getDate() : e.getDate() ;
                // var y=e.getFullYear();
                // var formatDate=m+"/"+d+"/"+y;//此处日期的格式化和speciald中的格式一样
                // var project_name=$("#projectCurName").val();
                // get_overview_scene(project_name,formatDate,heatmap_id)
//                 
          // }
	});
}	

$(document).on('click','.btn_heatmap',function(){     //点击查看按钮
	heatmap_id=$(this).attr("id").split("_")[2];
	heatmap_scene=$("#"+"heatmap_scene_"+heatmap_id).val();
	if(heatmap_scene==$("#"+"heatmap_scene_"+heatmap_id+" option:first").val()){
		alert("请先选择场景");
		return;
	}
	heatmap_date=$("#heatmap_date_"+heatmap_id).val();

	//alert(heatmap_time);
	heatmap_time=$("#heatmap_time_"+heatmap_id).val();
	if(heatmap_time==undefined){heatmap_time='';}	
	else if(heatmap_time==$("#"+"heatmap_time_"+heatmap_id+" option:first").val()){
		alert("请先选择时间");
		return;
	}
	//alert(heatmap_time)
	// if (heatmap_time!=''){
	// heatmap_time=$("#heatmap_time_"+heatmap_id).val().split("_")[0];
	// }
	//alert(heatmap_time+'0000')
	heatmap_cate=$("#heatmap_content_"+heatmap_id+" div:eq(0) ul:eq(0) .active a:eq(0)").attr("id").slice(0,-2); 
//	heatmap_cate="d_fps";  //默认检查帧率
	project_name=$("#projectCurName").val();
	get_overview_data(project_name,heatmap_scene,heatmap_date,heatmap_cate,heatmap_id,heatmap_time,$('#echart_heatmap_'+heatmap_id).height(),$('#echart_heatmap_'+heatmap_id).width());	
});

$(document).on('click','.btn_heatmaptips',function(){ //点击提交按钮
	heatmap_id=$(this).attr("id").split("_")[2];
	//alert(heatmap_id)
	heatmap_scene=$("#"+"heatmap_scene_"+heatmap_id).val();
	if(heatmap_scene==$("#"+"heatmap_scene_"+heatmap_id+" option:first").val()){
		alert("请先选择场景");
		return;
	}
	heatmap_date=$("#heatmap_date_"+heatmap_id).val();
	heatmap_time=$("#heatmap_time_"+heatmap_id).val();
	if(heatmap_time==undefined){heatmap_time='';}
	else if(heatmap_time==$("#"+"heatmap_time_"+heatmap_id+" option:first").val()){
		alert("请先选择时间");
		return;
	}
	heatmap_tips=$("#"+"heatmap_tips_"+heatmap_id).val();
	if (heatmap_tips==''){
		alert("请先输入备注");
		return;}
	project_name=$("#projectCurName").val();
	write_heatmap_tips(project_name,heatmap_id,heatmap_scene,heatmap_date,heatmap_time,heatmap_tips);
	//get_overview_data(project_name,heatmap_scene,heatmap_date,heatmap_cate,heatmap_id,heatmap_time);

});

$(document).on('click','.heatmap_cate',function(){     //点击帧率、内存等分页
	tmp_length=$(this).attr("id").split("_").length;
	heatmap_id=$(this).attr("id").slice(-1);
	heatmap_scene=$("#"+"heatmap_scene_"+heatmap_id).val();
	if(heatmap_scene==$("#"+"heatmap_scene_"+heatmap_id+" option:first").val()){
		alert("请先选择场景");
		return;
	}
	heatmap_date=$("#heatmap_date_"+heatmap_id).val();
	heatmap_time=$("#heatmap_time_"+heatmap_id).val();	
	
	if(heatmap_time==undefined){heatmap_time='';}	
	else if(heatmap_time==$("#"+"heatmap_time_"+heatmap_id+" option:first").val()){
		alert("请先选择时间");
		return;
	}
	heatmap_cate=$(this).attr("id").slice(0,-2); 
	project_name=$("#projectCurName").val();
	get_overview_data(project_name,heatmap_scene,heatmap_date,heatmap_cate,heatmap_id,heatmap_time,$('#echart_heatmap_'+heatmap_id).height(),$('#echart_heatmap_'+heatmap_id).width());	
});

$(document).on('click','.heatmap_div_addable',function(){
	heatmap_id=$(this).attr("id").split("_")[2];
	show_heatmap(heatmap_id);
	show_add_heatmap(heatmap_id);
});

$(document).on('click','.jqeury_calendar',function(){   //更改日期时，去掉时间点的下拉框
	heatmap_id=$(this).attr("id").split("_")[2];
	$('#heatmap_moredata_'+heatmap_id).html('');
});

$(document).on('click','.heatmap_scene',function(){   //更改场景时，去掉时间点的下拉框
	heatmap_id=$(this).attr("id").split("_")[2];
	$('#heatmap_moredata_'+heatmap_id).html('');
});

function show_heatmap(heatmap_id){	
	$("#heapmap_addable_"+heatmap_id).hide();
	$("#heatmap_div_"+heatmap_id).show();
	$("#heatmap_content_"+heatmap_id).show();
	$("#heatmap_title_"+heatmap_id).show();
	$('#heatmap_date_'+heatmap_id).val($("#now").val());
	
	
}

function write_heatmap_tips(project_name,heatmap_id,heatmap_scene,heatmap_date,heatmap_time,heatmap_tips){
	$.get('write_heatmap_tips',{
	'project_name':project_name,
	'heatmap_scene':heatmap_scene,
	'heatmap_date':heatmap_date,
	'heatmap_time':heatmap_time,
	'heatmap_tips':heatmap_tips,
	},function(ret){
	show_heatmaptips(ret,heatmap_id)},
	'text');

}

function show_heatmaptips(ret,heatmap_id){
	ret=jQuery.parseJSON(ret);
	alert("热力图备注成功！");
	var heatmap_tips=ret.heatmap_tips;
	$('#heatmap_tips_'+heatmap_id).html(heatmap_tips);
}



function show_add_heatmap(heatmap_id){
	var next_id=String(Number(heatmap_id)+1);
	$("#heatmap_div_"+next_id).show();
	$("#heatmap_content_"+next_id).hide();	
}

function get_overview_data(project_name,heatmap_scene,heatmap_date,heatmap_cate,heatmap_id,heatmap_time,height,width) {
    $.get('get_overview_data', {
        'heatmap_scene': heatmap_scene,
        'heatmap_date':heatmap_date,
        'heatmap_cate':heatmap_cate,
        'project_name':project_name,
        'heatmap_time':heatmap_time,
        'heatmap_height':height,
        'heatmap_width':width,
    }, function(ret){
		heatmap_draw(ret,heatmap_id);
		ret=jQuery.parseJSON(ret);
		if(ret.primStandard!=undefined){
			$("#standard").html('<p>该场景<span style="color: red;">'+ret.render_levelstr+'</span>的性能标准：面数小于<span style=\"color: red;\">'+ret.primStandard+'</span>，DP小于：<span style=\"color: red;\">'+ret.dpStandard+'</span>，特效数小于：<span style=\"color: red;\">'+ret.totalsfxStandard+'</span>，子特效数小于：<span style=\"color: red;\">'+ret.subsfxStandard+'</span></p>');
			$("#standard").show();
		}
		else{$("#standard").hide();}

    },'text');
}



function get_overview_scene(newdate,newid) {
	var project_name=$("#projectCurName").val();
	var heatmap_date=newdate;
	var heatmap_id=newid.split("_")[2];
    $.get('get_overview_scene', {
        'heatmap_date':heatmap_date,
        'project_name':project_name,
    }, function(ret){
		$("#heatmap_scene_"+heatmap_id).html(ret);
    },'text');
}
function sceneimg_position(scaleconf){
//	var img_position={"yewai1":{
//		                        "big":'<img src="/GeneralCheckPlat/static/img/GeneralCheckPlat/yewai1.bmp" style="height: 520px;position:absolute;left: 40px;top:38px; ">',
//		                        "small":'<img src="/GeneralCheckPlat/static/img/GeneralCheckPlat/yewai1.bmp" style="height: 420px;width: 500px;position:absolute;left: 0px;top:-15px; ">',
//		                       },
//		              "zhucheng":{
//		                        "big":'<img src="/GeneralCheckPlat/static/img/GeneralCheckPlat/zhucheng.bmp" style="height: 560px;position:absolute;left: 28px;top:30px; ">',
//		                        "small":'<img src="/GeneralCheckPlat/static/img/GeneralCheckPlat/zhucheng.bmp" style="height: '+560*scale+'px;position:absolute;left:'+(45-80+28)*scale+'px;top:'+(30-80+30)*scale+'px; ">',
//		                        }
//		             };
//	if(!img_position[scenename]){return '';}
//	if(IsBigScale){return img_position[scenename]["big"];}
//	else{return img_position[scenename]["small"];}
	var imgpath="";
	if(scaleconf["img"]!=''){imgpath='/static/img/GenralCheckPlat/'+scaleconf["img"];}
	return '<img src="'+imgpath+'" style="height: '+scaleconf["height"]+'px;position:absolute;left:'+scaleconf["left"]+'px;top:'+scaleconf["top"]+'px; ">';

	}

function get_overview_time(newid) {
	var project_name=$("#projectCurName").val();
	var heatmap_id=newid.split("_")[2];
	var heatmap_date=$("#heatmap_date_"+heatmap_id).val();
	var heatmap_scene=$("#heatmap_scene_"+heatmap_id).val();
	//alert(heatmap_scene)
	//alert(heatmap_date)
	//alert(heatmap_id)
    $.get('get_overview_time', {
        'heatmap_date':heatmap_date,
        'project_name':project_name,
        'heatmap_scene':heatmap_scene,
    }, function(ret){
		//$("#heatmap_scene_"+heatmap_id).html(ret)
		$("#heatmap_moredata_"+heatmap_id).html(ret);
		
		$('#heatmap_moredata_'+heatmap_id).children("select").attr('id','heatmap_time_'+heatmap_id);
		//alert(ret.theday_times)
    },'text');
}


function heatmap_draw(ret,heatmap_id){
    	ret=jQuery.parseJSON(ret);
//        heatmap_select_time=ret.heatmap_select_time;       //多个时间点时，增加下拉框
//        //alert(heatmap_select_time)
//        $('#heatmap_moredata_'+heatmap_id).html(heatmap_select_time);
//        $('#heatmap_moredata_'+heatmap_id).children("select").attr('id','heatmap_time_'+heatmap_id);
        if(ret.points==''){$('#echart_heatmap_'+heatmap_id).html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp没有获取到数据");$('#echart_heatmap_'+heatmap_id).css('font-size',17);return;}
		if(ret.scaleconf["img"]=='default'){$('#echart_heatmap_'+heatmap_id).html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbs新场景，请联系roro(gzchenyuting@corp.netease.com)添加配置。");$('#echart_heatmap_'+heatmap_id).css('font-size',17);return;}   	
//		var heatchart = echarts.init(document.getElementById("echart_heatmap_"+heatmap_id));
    	var heatpos = [];
    	var IsBigScale=parseInt($('#echart_heatmap_'+heatmap_id).width())>800;		
    	var scenename=$("#"+"heatmap_scene_"+heatmap_id).val();		
    	$("#echart_heatmap_"+heatmap_id).html(sceneimg_position(ret.scaleconf));		
        var heatmap_tips=ret.heatmap_tips;
        //alert(heatmap_tips)
        var heatmaptips = document.getElementById("heatmap_tips_"+heatmap_id);
		heatmaptips.value = heatmap_tips;
  //  	alert(heatpos);
    	// var imgpos = document.body.clientWidth*0.15;
    	// imginstance.style.marginLeft = imgpos + 'px';
        heatmap_cate=$('#heatmap_content_'+heatmap_id+' div:first ul:first').find("li.active").children("a").attr("id").slice(0,-2);
    	heatmapInstance = {
        my_chart: null,
        init: function(ret) {
            var config = {
                container: document.getElementById("echart_heatmap_"+heatmap_id),
                radius: ret.scaleconf.radius-1,
                maxOpacity: 0.8,
                minOpacity: 0.1,
                blur: 0.65,
            };
            this.my_chart = h337.create(config);
        },
        draw: function(ret) {
            var pro_data = { 
	          min: ret.minvalue,
		   	  max: ret.maxvalue,
              data:ret.points,
            };
            this.my_chart.setData(pro_data);
        },
    };
    heatmapInstance.init(ret);
    heatmapInstance.draw(ret);
}

function get_colorsort(cate){
	increase_danger_cate=['d_rss','d_drawcall','d_prim_num'];
	decrease_danger_cate=['d_fps','d_render_fps'];
	colorlist=['#313695', '#4575b4', '#74add1', '#abd9e9',  '#66CC99', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
	for(var i=0;i<decrease_danger_cate.length;i++){if(cate==decrease_danger_cate[i]){return colorlist.reverse();}}
	return colorlist;
//	if(cate in decrease_danger_cate){alert(colorlist.reverse());return colorlist.reverse();}   
//	else{alert('not');return colorlist;}   //默认传递增颜色，避免新增类别，没有同步danger_cate配置，显示不出
}	
	
function bigger_heatmap_1(){
	$("#heatmap_div_1").removeClass("col-md-6").addClass("col-md-11");
	$("#heatmap_content_1").css("height","1100");
	$("#heatmap_content_1 div:first").removeClass("col-xs-2").addClass("col-xs-1");
	$("#echart_heatmap_1").css("height","1100");	
}	

function normal_heatmap_1(){
	$("#heatmap_div_1").removeClass("col-md-11").addClass("col-md-6");
	$("#heatmap_content_1").css("height","470");
	$("#heatmap_content_1 div:first").removeClass("col-xs-1").addClass("col-xs-2");
	$("#echart_heatmap_1").css("height","470");		
}
	
$(document).on('click','#heatmap_add',function(){
	normal_heatmap_1();
	$("#heatmap_add").hide();
	show_add_heatmap("1");
	show_heatmap("2");
	show_add_heatmap("2");
	if($("#heatmap_scene_1").val()!=$("#heatmap_scene_1 option:first").val()){
		$("#btn_heatmap_1").trigger("click");   //模拟点击事件
		return;
	}
});


$(document).ready(function(){
	show_heatmap("1");
	bigger_heatmap_1();
});

//$(document).on('click','#uploadfile',function(){
//    //alert("111111111111111");
//    //myfile=new FormData($('#uploadForm')[0]);
//    //alert(myfile);
//     var fileobj = $('#file')[0].files[0];   //先将jquery对象转换为dom对象
//     var form = new FormData();
//            //form.append('byd',$('#byd').val());
//     form.append('file',fileobj);
//     upload_file(form);
//});
//
//function upload_file(file) {
//    //alert("2222222222")
//    $.post('upload_file',{
//        'file':file
//    },function(data){
//		alert(data);
//    },'text');
//}

//$("#uploadfile").click(function(){
//    alert(new FormData($('#uploadForm')[0]));
//    alert("1111111111111");
//     //获取单选按钮的值
//    $.ajax({
//            type: 'POST',
//            // data:$('#uploadForm').serialize(),
//            data:new FormData($('#uploadForm')[0]),
//            processData : false,
//            contentType : false, //必须false才会自动加上正确的Content-Type
//            // cache: false,
//            success:function(response,stutas,xhr){
//              // parent.location.reload();
//              //window.location.reload();
//              // alert(stutas);
//              alert(response);
//            },
//            // error:function(xhr,errorText,errorStatus){
//            //   alert(xhr.status+' error: '+xhr.statusText);
//            // }
//            timeout:6000
//        });
//
//  });

function jquery_upload() {
            //jquery和dom对象互相转换
            //jquery --> dom    jqueryobj[0]
            // dom--->jquery    $(domobj)
            var fileobj = $('#file')[0].files[0];   //先将jquery对象转换为dom对象
            var form = new FormData();
            //form.append('byd',$('#byd').val());
            form.append('file',fileobj);
            $.ajax({
                url:'upload_file',
                type:'POST',
                data:form,
                processData:false,   //设置不对数据进行自处理，默认jquery会对上传的数据进行处理
                contentType:false,   //设置不添加请求头的内容类型
                success:function (arg) {
                    alert(arg)
                    window.location.href="http://arkqa.nie.netease.com/GeneralCheckPlat/"
                }

            });
        }

function scale_canvas(){
        var canvas = document.getElementsByClassName("heatmap-canvas")[0];
        console.log(canvas);
        var ctx = canvas.getContext('2d')
        ctx.scale(0.5,0.5);
}