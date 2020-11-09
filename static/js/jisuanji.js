var oTd = document.getElementsByClassName("td");
var oK = document.getElementById("ok");
var oShow = document.getElementById("show");
var oClear = document.getElementById("clear");
var run = '';//全局变量 公式

oK.onclick=function(){
  if(run!==""){
    oShow.innerHTML = eval(run);
  }
  if(oShow.innerHTML!=="0"){
    run = show.innerHTML;
  }
}

oClear.onclick=function(){
  run = '';
  show.innerHTML = '0';
}

for(var i = 0;i<=oTd.length;i++){
  oTd[i].index = i;
  oTd[i].onclick=function(){
    //alert(oTd[this.index].innerHTML)
    run += oTd[this.index].innerHTML;
   oShow.innerHTML = run;
  };
}