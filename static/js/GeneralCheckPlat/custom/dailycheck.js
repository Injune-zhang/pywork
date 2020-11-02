function init_calendar2(){     //加载时间控件
	var speciald=jQuery.parseJSON($("#dateList").val());
	var defaultdate=$("#now").val();
	var defualtdate2=defaultdate.substr(6,4)+"/"+defaultdate.substr(0,5);
	$(".jqeury_calendar_dailycheck").datetimepicker({
			closeOnDateSelect:true,
			format:'m/d/Y',
			defaultDate:defualtdate2,
			beforeShowDay: function( date ) {
                var m=(date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth() + 1);
                var d=date.getDate() < 10 ? "0" + date.getDate() : date.getDate() ;
                var y=date.getFullYear();
                var formatDate=m+"/"+d+"/"+y;//此处日期的格式化和speciald中的格式一样
                
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
	});
}	

$(document).ready(function(){
	init_calendar2();
});

// $(document).on('click','#btn_dailycheck',function(){     //点击查看按钮
	// dailycheck_date=$("#dailycheck_date").val();
	// project_name=$("#projectCurName").val();
	// //检查分类默认设为第一个
	// errorid="1";
	// get_overview_dailydata(project_name,errorid,dailycheck_date);	
// });

function startcheck(){             //更改日期时触发
	dailycheck_date=$("#dailycheck_date").val();
	project_name=$("#projectCurName").val();
	//检查分类默认设为第一个
	errorid="1";
	get_overview_dailydata(project_name,errorid,dailycheck_date);		
}

$(document).on('click','.collapsed',function(){     //点击检查分页
	var errorContent=$(this).next().find("div").html();
	if(errorContent.indexOf("table")>=0){return;}
	dailycheck_date=$("#dailycheck_date").val();
	project_name=$("#projectCurName").val();
	//检查分类默认设为第一个
	errorid=$(this).attr("id");
	var isMore=0;
	get_overview_moredailydata(project_name,errorid,dailycheck_date,isMore);	
}); 

$(document).on('click','.moreError',function(){     //点击更多错误
	errorid=$(this).attr("id").split("_")[1];
	$(this).remove();
	dailycheck_date=$("#dailycheck_date").val();
	project_name=$("#projectCurName").val();
	var isMore=1;
	get_overview_moredailydata(project_name,errorid,dailycheck_date,isMore);	
}); 


function get_overview_dailydata(project_name,errorid,dailycheck_date){   //加载新查看的内容
	$.get('get_resource_data', {
        'dailycheck_date':dailycheck_date,
        'project_name':project_name,
        'errorid':errorid,
    }, function(ret){
		$("#accordion1").html(ret);
		$("#"+errorid).removeClass("collapsed ");
		$("#"+errorid).attr("aria-expanded","true");
		$("#collapse_"+errorid).addClass("in");
		$("#collapse_"+errorid).attr("aria-expanded","true");	
		$("#collapse_"+errorid).removeAttr("style");		
		
    },'text');
}

function get_overview_moredailydata(project_name,errorid,dailycheck_date,isMore){  //加载更多错误
	$.get('get_resource_moredata',{
        'dailycheck_date':dailycheck_date,
        'project_name':project_name,
        'errorid':errorid,	
        'isMore':isMore,
	},function(ret){
		if(isMore==0){   //点击分页的情况
			$("#"+errorid).removeClass("collapsed ");
			$("#"+errorid).attr("aria-expanded","true");
			$("#collapse_"+errorid).addClass("in");
			$("#collapse_"+errorid).attr("aria-expanded","true");	
			$("#collapse_"+errorid).removeAttr("style");	
			$("#collapse_"+errorid+" div").html(ret);
		} 
		else{$("#collapse_"+errorid+" div").append(ret);}   //点击加载更多的情况
	//	$("#collapse_"+errorid+" div h5").remove();
		
	},'text');
}
