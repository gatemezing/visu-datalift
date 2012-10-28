function initializeMap() {
		
        var myOptions = {
          center: new google.maps.LatLng(47.510, 2.217),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
         map= new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
		map.setZoom(4);
		
		google.maps.event.addListener(map, 'center_changed', function() {
        try{
			mc.setMap(null);
		}catch(err){}
		var northeast = map.getBounds().getNorthEast();
		var southwest = map.getBounds().getSouthWest();
		var type = $("h1[name='venues_stats'] + section section a.selected").html();
		switch(type)
		{
			case "Events":
				markers = getEventsLocation(northeast,southwest);
				break;
			case "Photos":
				markers = getPhotosLocation(northeast,southwest);
				break;
			case "Venues":
				markers = getVenuesLocation(northeast,southwest);
				break;
		}
		
		mc= new MarkerClusterer(map, markers);
	
    });
	
}

function getEventsLocation(northeast,southwest){
	var query_count = "select  ?lat ?lon ?title where{?event a lode:Event. ?event dc:title ?title. ?event lode:inSpace ?space. ?space geo:lat ?lat. ?space geo:long ?lon. filter(xsd:double (?lat) > "+southwest.lat()+" && xsd:double (?lat) < "+northeast.lat()+") filter(xsd:double (?lon) > "+southwest.lng()+" && xsd:double (?lon) < "+northeast.lng()+")}LIMIT 500 ";
	var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
	var res = json.results.bindings;
	var markers=[];
	$.each(res,function(index,value){
			 var marker = new google.maps.Marker({'position': new google.maps.LatLng(value.lat.value,value.lon.value),'title': value.title.value});
			 markers.push(marker);
		});
		return markers;
}
function getVenuesLocation(northeast,southwest){
	var query_count = "select  distinct ?lat ?lon ?title where{?event a lode:Event. ?event lode:atPlace ?venue. ?venue rdfs:label ?title. ?event lode:inSpace ?space. ?space geo:lat ?lat. ?space geo:long ?lon. filter(xsd:double (?lat) > "+southwest.lat()+" && xsd:double (?lat) < "+northeast.lat()+") filter(xsd:double (?lon) > "+southwest.lng()+" && xsd:double (?lon) < "+northeast.lng()+")}LIMIT 500 ";
	var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
	var res = json.results.bindings;
	var markers=[];
	$.each(res,function(index,value){
			 var marker = new google.maps.Marker({'position': new google.maps.LatLng(value.lat.value,value.lon.value),'title': value.title.value});
			 markers.push(marker);
		});
		return markers;
}
function getPhotosLocation(northeast,southwest){
	var query_count = "select ?lat ?lon ?title ?url where{?p a ma:Image. ?p dc:title ?title. ?p ma:locator ?url. ?p lode:illustrate ?e. ?e lode:inSpace ?space. ?space geo:lat ?lat. ?space geo:long ?lon. filter(xsd:double (?lat) > "+southwest.lat()+" && xsd:double (?lat) < "+northeast.lat()+") filter(xsd:double (?lon) > "+southwest.lng()+" && xsd:double (?lon) < "+northeast.lng()+")}LIMIT 500 ";
	var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
	var res = json.results.bindings;
	var markers=[];
	$.each(res,function(index,value){
			
		/*var infowindow = new google.maps.InfoWindow({
			content: "<img src='"+value.url.value+"'/><h3>"+value.title.value+"</h3>"
		});*/
        
		var marker = new google.maps.Marker({'position': new google.maps.LatLng(value.lat.value,value.lon.value),'title': value.title.value});
       /* google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});*/
			 
			 markers.push(marker);
		});
		return markers;
}