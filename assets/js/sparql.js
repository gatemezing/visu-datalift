function sparqlQuery(query, baseURL, format) {
	if(!format)
		format="application/json";
	var params={
		"default-graph": "",  "query": query,
		"debug": "on", "timeout": "", "format": format,
		"save": "display", "fname": ""
	};
	
	var querypart="";
	for(var k in params) {
		querypart+=k+"="+encodeURIComponent(params[k])+"&";
	}
	var queryURL=baseURL + '?' + querypart;
	if (window.XMLHttpRequest) {
  	xmlhttp=new XMLHttpRequest();
  }
  else {
  	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.open("GET",queryURL,false);
  xmlhttp.send();
  return JSON.parse(xmlhttp.responseText);
}