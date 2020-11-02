function init_calendar2(){     //加载时间控件
	var speciald=jQuery.parseJSON($("#dateList").val());
	var defaultdate=$("#now").val();
	var defualtdate2=defaultdate.substr(6,4)+"/"+defaultdate.substr(0,5);
	$(".jqeury_calendar_performance").datetimepicker({
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