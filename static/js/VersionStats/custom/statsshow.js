/*图形绘制部分——————————————————————————*/
//var fd = new FormData();
laydate.render({    //设置日期选择格式
    elem:'#choosedate1',
    });

laydate.render({    //设置日期选择格式
    elem:'#choosedate2',
    });

/*-------------------------- +
  获取id, class, tagName
 +-------------------------- */
var get = {
	byId: function(id) {
		return typeof id === "string" ? document.getElementById(id) : id
	},
	byClass: function(sClass, oParent) {
		var aClass = [];
		var reClass = new RegExp("(^| )" + sClass + "( |$)");
		var aElem = this.byTagName("*", oParent);
		for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
		return aClass
	},
	byTagName: function(elem, obj) {
		return (obj || document).getElementsByTagName(elem)
	}
};
var dragMinWidth = 250;
var dragMinHeight = 250;

/*-------------------------- +
  拖拽函数
 +-------------------------- */
function drag(oDrag, handle)
{
	var disX = dixY = 0;
	var oMin = get.byClass("min", oDrag)[0];
	var oMax = get.byClass("max", oDrag)[0];
	var oRevert = get.byClass("revert", oDrag)[0];
	var oClose = get.byClass("close", oDrag)[0];
	handle = handle || oDrag;
	handle.style.cursor = "move";
	handle.onmousedown = function (event)
	{
		var event = event || window.event;
		disX = event.clientX - oDrag.offsetLeft;
		disY = event.clientY - oDrag.offsetTop;

		document.onmousemove = function (event)
		{
			var event = event || window.event;
			var iL = event.clientX - disX;
			var iT = event.clientY - disY;
			var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
			var maxT = document.documentElement.clientHeight - oDrag.offsetHeight;

			iL <= 0 && (iL = 0);
			iT <= 0 && (iT = 0);
			iL >= maxL && (iL = maxL);
			iT >= maxT && (iT = maxT);

			oDrag.style.left = iL + "px";
			oDrag.style.top = iT + "px";

			return false
		};

		document.onmouseup = function ()
		{
			document.onmousemove = null;
			document.onmouseup = null;
			this.releaseCapture && this.releaseCapture()
		};
		this.setCapture && this.setCapture();
		return false
	};

	//阻止冒泡
	oMin.onmousedown = oMax.onmousedown = oClose.onmousedown = function (event)
	{
		this.onfocus = function () {this.blur()};
		(event || window.event).cancelBubble = true
	};
}
/*-------------------------- +
  改变大小函数
 +-------------------------- */
function resize(oParent, handle, isLeft, isTop, lockX, lockY)
{
	handle.onmousedown = function (event)
	{
		var event = event || window.event;
		var disX = event.clientX - handle.offsetLeft;
		var disY = event.clientY - handle.offsetTop;
		var iParentTop = oParent.offsetTop;
		var iParentLeft = oParent.offsetLeft;
		var iParentWidth = oParent.offsetWidth;
		var iParentHeight = oParent.offsetHeight;

		document.onmousemove = function (event)
		{
			var event = event || window.event;

			var iL = event.clientX - disX;
			var iT = event.clientY - disY;
			var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;
			var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;
			var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
			var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;

			isLeft && (oParent.style.left = iParentLeft + iL + "px");
			isTop && (oParent.style.top = iParentTop + iT + "px");

			iW < dragMinWidth && (iW = dragMinWidth);
			iW > maxW && (iW = maxW);
			lockX || (oParent.style.width = iW + "px");

			iH < dragMinHeight && (iH = dragMinHeight);
			iH > maxH && (iH = maxH);
			lockY || (oParent.style.height = iH + "px");

			if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;

			return false;
		};
		document.onmouseup = function ()
		{
			document.onmousemove = null;
			document.onmouseup = null;
			//重新渲染echarts
            printChat(statistics);

		};
		return false;
	}
};
window.onload = window.onresize = function ()
{
	var oDrag = document.getElementById("drag");
	var oTitle = get.byClass("title", oDrag)[0];
	var oL = get.byClass("resizeL", oDrag)[0];
	var oT = get.byClass("resizeT", oDrag)[0];
	var oR = get.byClass("resizeR", oDrag)[0];
	var oB = get.byClass("resizeB", oDrag)[0];
	var oLT = get.byClass("resizeLT", oDrag)[0];
	var oTR = get.byClass("resizeTR", oDrag)[0];
	var oBR = get.byClass("resizeBR", oDrag)[0];
	var oLB = get.byClass("resizeLB", oDrag)[0];

	drag(oDrag, oTitle);
	//四角
	resize(oDrag, oLT, true, true, false, false);
	resize(oDrag, oTR, false, true, false, false);
	resize(oDrag, oBR, false, false, false, false);
	resize(oDrag, oLB, true, false, false, false);
	//四边
	resize(oDrag, oL, true, false, false, true);
	resize(oDrag, oT, false, true, true, false);
	resize(oDrag, oR, false, false, false, true);
	resize(oDrag, oB, false, false, true, false);

	oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 12 + "px";

}

/*——————————————————————————————————————————————*/

function quickview_Onc(value){
    var curVers = document.getElementById("curVers").value;
    if(document.getElementById("developFinishRate").checked == true){
        if (checkcanquery() == false){
            return false;
        }
        document.getElementById("xtype2").checked = true;
        vesionChoose_Onc();
        $("#itemSelect").val("developFinishRate_all");
        $("#itemSelect").multiselect("refresh");
        setTimeout("queryStats()",1000);
    }
    else if(document.getElementById("testFinishRate").checked == true){
        if (checkcanquery() == false){
            return false;
        }
        document.getElementById("xtype2").checked = true;
        vesionChoose_Onc();
        $("#itemSelect").val("testFinishRate_all");
        $("#itemSelect").multiselect("refresh");
        setTimeout("queryStats()",1000);
    }
    else if(document.getElementById("moveOutRate").checked == true){
        document.getElementById("xtype1").checked = true;
        vesionChoose_Onc();
        $("#versionSelect").val([curVers-1,curVers-2,curVers-3,curVers-4,]);
        $("#versionSelect").multiselect("refresh");
        $("#itemSelect").val(["moveOutRateByVers","moveOutNum"]);
        $("#itemSelect").multiselect("refresh");
        setTimeout("queryStats()",1000);
    }
}
function vesionChoose_Onc(){
    if(document.getElementById("xtype1").checked == true){
        $("#daySelect").multiselect("disable");
        $("#versionSelect").multiselect("enable");
        document.getElementById("extracond").checked = false;
        document.getElementById("extracond").disabled = false;
        $("#condSelect").val("");
        condSelect_Onch("");
        $("#condSelect").multiselect("refresh");
        getstatsitemByVersions();

    }
    else if (document.getElementById("xtype2").checked == true){//选择按周几
        $("#daySelect").multiselect("enable");
        $("#versionSelect").multiselect("disable");
        document.getElementById("extracond").checked = true;
        document.getElementById("extracond").disabled = true;
        $("#condSelect").val("forVersion");//当选择按周几时，直接弹出选择额外选项的周版本
        $("#condSelect").multiselect("disable");
        $("#condSelect2").multiselect("enable");
        condSelect_Onch("forVersion");
        $("#condSelect").multiselect("refresh");
        getstatsitmeByDay();
    }
    else{
        alert("错误！");
    }
}

function extracond_Onc(){//勾选额外条件复选框时
    if(document.getElementById("extracond").checked == true){
        var StatsItem =  $("#itemSelect").multiselect("MyValues");
        var StatsItemNameList = getitemname().split(',');
        console.log(StatsItemNameList);
        if(StatsItem == ""){
            alert("请选择数据项");
            document.getElementById("extracond").checked = false;
            return false;
        }
        s = StatsItem.split('+');
        var statsItemCantExtra_temp = $("#statsItemCantExtra").val();
        var statsItemCantExtra =  JSON.parse(statsItemCantExtra_temp);
        for (eachitem in s)
        {
            console.log(eachitem);
            if ( $.inArray(s[eachitem],statsItemCantExtra) != -1)
            {
                alert("数据项中有<"+StatsItemNameList[eachitem]+">时不能选择额外条件");
                document.getElementById("extracond").checked = false;
                return false;
            }
        }
        $("#condSelect").multiselect("enable");
        $("#condSelect2").multiselect("enable");
    }
    else{
        $("#condSelect").multiselect("disable");
        $("#condSelect2").multiselect("disable");
    }
}

function condSelect_Onch(value){//额外条件变化时，自动选择curvers当前版本的前一个版本
    if (value == "forPerson" || value == "forType" || value == "forVersion"){//选择后会把控件显示
        document.getElementById("condSelect2_span").style.visibility="visible";
        refreshMultiSelect(value);
    }
    else{
        document.getElementById("condSelect2_span").style.visibility="hidden";
    }
}

function refreshMultiSelect(cond){//更新condselect2的option
    $.ajax({
        type : "POST",
        url : 'getcondselect2Item',
        data : {'cond':cond,},
        dataType : "json",
        success : function(json) {
            $("#condSelect2").html("");
            var curVers = document.getElementById("curVers").value;
            var preVers = curVers - 1
            console.log("当前版本是："+curVers);
            for (var i = 0; i < json.length; i++) {
                if (json[i].hasOwnProperty("isMajor") ) {
                    if (json[i].isMajor == 1) {
                        $("#condSelect2").append("<option value='" + json[i].id + "' selected>" + json[i].name + "</option>");
                    }
                    else{
                        $("#condSelect2").append("<option value='" + json[i].id + "'>" + json[i].name + "</option>");
                    }
                }
                else{
                    if(json[i].id == preVers && cond == "forVersion"){
                        $("#condSelect2").append("<option value='" + json[i].id + "'selected>" + json[i].name + "</option>");
                    }
                    else{
                        $("#condSelect2").append("<option value='" + json[i].id + "'>" + json[i].name + "</option>");
                    }
                }

            }
            $("#condSelect2").multiselect("destroy").multiselect({
                noneSelectedText: "请选择",
                checkAllText: "全选",
                uncheckAllText: '全不选',
                selectedText: '# 被选择',
                selectedList:3 ,
            });
        }
    });
}


//更新数据
function updatenow(){
    $.ajax({
    url:'updatenow',
    type:'POST',
    data:{},
    beforeSend:function(XMLHttpRequest){
            $("#updatenow").html("正在更新，请稍后···");
            $('#updatenow').attr("disabled",true);
        },
    success:function (ret) {
        if(ret == "error"){
            alert("更新失败");
        }
        else if(ret == "lock"){
            alert("其他人在更新");
        }
        else{
            alert("更新成功") ;
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        // 状态码
        console.log(XMLHttpRequest.status);
        // 状态
        console.log(XMLHttpRequest.readyState);
        // 错误信息
        console.log(textStatus);
    },
    complete:function(XMLHttpRequest,textStatus){

            $("#updatenow").html("更新数据");
            $('#updatenow').attr("disabled",false);
        },
    });
}

function getupdatetime(){
    var showDiv = document.getElementById('updatenow');
    var time = document.getElementById("updateTime").value
    showDiv.title = "数据截至："+time;
}



function queryStats(){//点击查询
    var XType = getXType();
    if(XType==false){
        //alert("未选择必要项！");
        return ;
    }
    var StatsItem = getitem();
    if(StatsItem == false){
        return;
    }
    var StatsItemName = getitemname();
    var ExtraCond1 = "";
    var ExtraCond2 = {};
    if(document.getElementById("extracond").checked == true){//额外条件被选中
        if(document.getElementById("condSelect").value ==""){
            alert("未选择额外条件！");
            return;
        }
        //if(document.getElementById("condSelect").value == "forVersion"){//额外条件选择了对应版本
        if (document.getElementById("condSelect2").value == ""){//没有选择第二项
            alert("额外条件未选完全！");
            return;
        }
        else if($("#condSelect2").multiselect("MyValues").split("+").length > 8){//选择了8个以上的选项
            alert("最多选择8条！");
            return;
        }

        //}
         ExtraCond1 = document.getElementById("condSelect").value;
         ExtraCond2["id"] = $("#condSelect2").multiselect("MyValues");
         ExtraCond2["name"] = $("#condSelect2").multiselect("MyTexts");
    }
    mydata = {'XType':XType["type"],'XTypeId':XType["id"],"StatsItem":StatsItem,"ExtraCond1":ExtraCond1,"ExtraCond2Id":ExtraCond2["id"],"ExtraCond2Name":ExtraCond2["name"]};
    doajax(mydata);
    if(document.getElementById("extracond").checked == false){
        document.getElementById("chat_title").innerHTML = "<h3 contentEditable='true'>"+StatsItemName+"</h3>";
    }
    else{
        var cond2ItemName = getcond2name();
        document.getElementById("chat_title").innerHTML = "<h3 contentEditable='true'>"+cond2ItemName+StatsItemName+"</h3>";
    }

}

//将后台返回的数据作为一个全局变量保存
var statistics ;

function doajax(mydata){
    $.ajax({
    url:'getstats',
    type:'POST',
    data:mydata,
    beforeSend:function(XMLHttpRequest){
            $("#doing").html("正在处理，请稍后···");
        },
    success:function (ret) {
        statistics=JSON.parse(ret);
        printChat(statistics);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        // 状态码
        console.log(XMLHttpRequest.status);
        // 状态
        console.log(XMLHttpRequest.readyState);
        // 错误信息
        console.log(textStatus);
    },
    complete:function(XMLHttpRequest,textStatus){

            $("#doing").empty();
        },
    });
}

function getXType(){ //获得选择的版本号，以+号间隔
    var xtype1 = document.getElementById("xtype1");
    var xtype2 = document.getElementById("xtype2");
    var XType = {};
    if (xtype1.checked == true){ //选择了“按版本”
        var XType_List = $("#versionSelect").multiselect("MyValues").split("+");
        if (XType_List.length > 8){
            alert("版本最多选择8条！");
            return false;
        }
        XType["type"] = "x_version"
        XType["id"] =  $("#versionSelect").multiselect("MyValues");
        XType["name"] = $("#versionSelect").multiselect("MyTexts");
    }
    else if(xtype2.checked == true){ //选择了按周几
        XType["type"] = "x_day"
        XType["id"] = $("#daySelect").multiselect("MyValues");
        XType["name"] = $("#daySelect").multiselect("MyTexts");
    }

    else{
        alert("好像哪里出了错");
        return false;
    }
    if(XType.id == ""){
        alert("请选择具体内容");
        return false;
    }
    return XType;
}


function getitem(){//获得数据项List,以+间隔
    var StatsItem =  $("#itemSelect").multiselect("MyValues");
    if(StatsItem == ""){
        alert("请选择数据项");
        return false;
    }
    return StatsItem;
}

function getitemname(){//获取选择了的数据项名称，用于显示
    var StatsItemName = $("#itemSelect").multiselect("MyTexts");
    return StatsItemName;
}

function getcond2name(){//获取选择了的额外数据项名称，用于显示
    var cond2ItemName = $("#condSelect2").multiselect("MyTexts");
    return cond2ItemName.split("（")[0];
}

function getstatsitemByVersions(){//获取x轴按版本数据项名称，并生成options
    $("#itemSelect").empty();
    var statsItemByVers_temp = $("#statsItemByVers").val();
    var statsItemByVers =  JSON.parse(statsItemByVers_temp);
    for(i=0;i<statsItemByVers.length;i++){
        var key = statsItemByVers[i].key;
        var itemname = statsItemByVers[i].itemname;
        $("#itemSelect").append("<option value="+key+">"+itemname+"</option>");
    }
    $("#itemSelect").multiselect( 'refresh' );

}

function getstatsitmeByDay(){//获取x轴按周几数据项名称，并生成options
    $("#itemSelect").empty();
    var statsItemByVers_temp = $("#statsItemByDay").val();
    var statsItemByVers =  JSON.parse(statsItemByVers_temp);
    for(i=0;i<statsItemByVers.length;i++){
        var key = statsItemByVers[i].key;
        var itemname = statsItemByVers[i].itemname;
        $("#itemSelect").append("<option value="+key+">"+itemname+"</option>");

    }
    $("#itemSelect").multiselect( 'refresh' );
}

//判断按每天的查询功能是否有，没有则不能查询了
function checkcanquery(){
    if (document.getElementById("xtype2").disabled == true){
        alert("该项目暂不支持按每天查询，该查询无法进行");
        return false;
    }
    else{
        return true;
    }
}

/*——————————————————————————————————————————*/


function printChat(statistics){
    $("#statschat").html("");
    loadStackEcharts("statschat",statistics);
}

function myChartContainer (){
    var myChart = document.getElementById('statschat');
    var oDrag = document.getElementById("drag");
    myChart.style.width = parseInt(oDrag.style.width) - 80 + 'px'
    myChart.style.height = parseInt(oDrag.style.height) - 120 + 'px'
}

//画图
function loadStackEcharts(stack_id,ret){
    myChartContainer();
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
    itemStyle:{ //这里设置好像没用，挪到series里了
        normal:{
            label:{
                show:true,
            },
        },
    },
    legend: {
        data:ret.reskindList
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        feature: {
            dataZoom: {
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar','stack'],option:{stack:{areaStyle:{}}},},

            restore: {},
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
            axisLabel:{
                interval:0
                      },
            type : 'category',
            boundaryGap : true,
            data : ret.dateList
        }
    ],
    yAxis : [
        {
            type : 'value',
        },
        {
            type : 'value',
            axisLabel: {
            formatter: '{value} %'
          }
        }
    ],
    series : ret.trendSeries
};

    // 使用刚指定的配置项和数据显示图表。
        StackChart.setOption(option);
}

/*——————————————————————————————————————————*/

$(document).ready(function (){
$("#versionSelect").multiselect({     //设置下拉多选框格式
			noneSelectedText: "请选择（最多选择8项）",
			checkAllText: "全选",
			uncheckAllText: '全不选',
			selectedText: '# 被选择',
			selectedList:1 ,
		});
$("#daySelect").multiselect({     //设置下拉多选框格式
			noneSelectedText: "请选择",
			checkAllText: "全选",
			uncheckAllText: '全不选',
			selectedText: '# 被选择',
			disabledClass:'disabled',
			selectedList:3 ,
		});

$("#itemSelect").multiselect({     //设置下拉多选框格式
			noneSelectedText: "请选择数据项",
			checkAllText: "全选",
			uncheckAllText: '全不选',
			selectedText: '# 被选择',
			selectedList:4 ,
		});

$("#condSelect").multiselect({     //设置下拉多选框格式
            multiple:false,
			noneSelectedText: "请选择",
			checkAllText: "全选",
			uncheckAllText: '全不选',
			selectedText: '# 被选择',
			selectedList:1 ,
		});

$("#condSelect2").multiselect({     //设置下拉多选框格式
			noneSelectedText: "请选择",
			checkAllText: "全选",
			uncheckAllText: '全不选',
			selectedText: '# 被选择',
			selectedList:1 ,
		});

getstatsitemByVersions();
});
