function getCount(type,name){
	var query_count = "select count(distinct ?s) where { ?s a "+type+".} ";
	var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
	var res = json.results.bindings;	
	var count = res[0]['callret-0']['value'];
   return $(document.createElement("div")).addClass("number").html("<h5>"+count+"</h5><p>"+name+"</p>");
}

function isGeoData(){
	var query_ask = "ask where {?x a ?c. ?c a ?class. ?x ?p ?o. filter(?class=owl:Class || ?class=rdfs:Class) filter(?p=geo:lat || ?p=geo:long)} ";
	var json=sparqlQuery(query_ask, "http://dbpedia.org/sparql/");	
	var res = json.results.bindings;	
	var answer = res['boolean']['value'];
   return $(document.createElement("div")).addClass("boolean").html("<h5>"+answer+"</h5>");
}

function getCountUnion(type, type2 ,name){
	var query_count = "select count(distinct ?s) where { {?s a "+type+". } union {?s a "+type2+".} }";
	var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
	var res = json.results.bindings;	
	var count = res[0]['callret-0']['value'];
   return $(document.createElement("div")).addClass("number").html("<h5>"+count+"</h5><p>"+name+"</p>");
}

function getEventsByCategory(category){
	var query_count = "select count(distinct ?s) where { ?s a lode:Event. ?s dc:subject ?c. FILTER(regex(?c,'"+category+"','i')). } ";
	var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
	var res = json.results.bindings;	
	var count = res[0]['callret-0']['value'];
   return $(document.createElement("div")).addClass("number").html("<h5>"+count+"</h5><p>"+category+"</p>");
}

function getCategories(){
	var query_count = "select distinct ?c where { ?s a lode:Event. ?s dc:subject ?c. } ";
	var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
	var resp = json.results.bindings;	
    var cat = new Array();	
	$.each(resp,function(index,value){
			cat.push(value.c.value);
		});
   return cat;
}

function getCountLocation(northeast,southwest){
	var query_count = "select  ?lat ?lon ?title where{?event a lode:Event. ?event dc:title ?title. ?event lode:inSpace ?space. ?space wgs84:lat ?lat. ?space wgs84:long ?lon. filter(xsd:double (?lat) > "+southwest.lat()+" && xsd:double (?lat) < "+northeast.lat()+") filter(xsd:double (?lon) > "+southwest.lng()+" && xsd:double (?lon) < "+northeast.lng()+")} ";
	var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
	var res = json.results.bindings;
	var markers=[];
	$.each(res,function(index,value){
			 var marker = new google.maps.Marker({'position': new google.maps.LatLng(value.lat.value,value.lon.value),'title': value.title.value});
			 markers.push(marker);
		});
		return markers;
}

/*function initialize(){
	initializeMap();
	getCount("lode:Event","Total Events").appendTo("body");
	getCount("ma:Image","Total Photos").appendTo("body");
	getCount("foaf:Agent","Total Agents").appendTo("body");
	getCount("dul:Place","Total Venues").appendTo("body");
	getCount("foaf:Person","Total Users").appendTo("body");
   
   var cat = getCategories();
    $.each(cat,function(index,value){
		getEventsByCategory(value).addClass("source").appendTo("body");	
	});
	
	
}*/


 function initializeMap() {
        var myOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
         map= new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
			
		google.maps.event.addListener(map, 'center_changed', function() {
        try{
			mc.setMap(null);
		}catch(err){}
		var northeast = map.getBounds().getNorthEast();
		var southwest = map.getBounds().getSouthWest();
		markers = getCountLocation(northeast,southwest);
		mc= new MarkerClusterer(map, markers);
	
    });
      }
	  
