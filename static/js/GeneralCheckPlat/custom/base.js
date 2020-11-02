$(document).on('click','.left_li',function(){     //切换左边大标签
	if(!$(this).hasClass("active")){
		$(".left_li").removeClass("active");
		$(".left_ul").css("display","none");
		$(this).addClass("active");
		$(this).children("ul:first").css("display","block");
	}
});

$(document).on('click','.child_li',function(){     //选择左边的小选项
	if(!$(this).hasClass("current-page")){
		$(this).siblings().removeClass("current-page");
		$(this).addClass("current-page");
		var projectCurName=$("#changeproject ul:first").children(".current-page").attr("id");
		var functionId=$("#changefunc ul:first").children(".current-page").attr("id");
		location.href=".?projectCurName="+projectCurName+"&functionId="+functionId;
		
		
	}
});