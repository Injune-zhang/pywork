function createXMLHttpRequest() {
	var xmlHttp;
	if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
		if (xmlHttp.overrideMimeType)
			xmlHttp.overrideMimeType('text/xml');
	} else if (window.ActiveXObject) {
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
			}
		}
	}
	return xmlHttp;
}

function log(click_url) {
	xmlHttp = createXMLHttpRequest();
    var url = "http://arkqa.nie.netease.com/log/";
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-Type",
	   "application/x-www-form-urlencoded;");
    xmlHttp.send("click_url="+click_url);
}

function postwith(to, p) {
var myForm = document.createElement("form");
myForm.method = "post";
myForm.action = to;
for ( var k in p) {
var myInput = document.createElement("input");
myInput.setAttribute("name", k);
myInput.setAttribute("value", p[k]);
myForm.appendChild(myInput);
}
document.body.appendChild(myForm);
myForm.submit();
document.body.removeChild(myForm);
}
