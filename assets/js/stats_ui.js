
function initialize() {
//CHARTS
  
     google.setOnLoadCallback(updateChart());
	 
	 
	 //NUMBERS
	getCount("lode:Event","Total Events").appendTo(".global_numbers");
	getCountUnion("<http://www.w3.org/ns/ma-ont#Image>","<http://www.w3.org/ns/ma-ontImage>","Total Photos").appendTo(".global_numbers");
	getCount("foaf:Agent","Total Agents").appendTo(".global_numbers");
	getCount("dul:Place","Total Venues").appendTo(".global_numbers");
	getCount("foaf:Person","Total Users").appendTo(".global_numbers");
	
	
	
	//EVENTS STATS
	 var cat = getCategories();
    $.each(cat,function(index,value){
		getEventsByCategory(value).addClass("source").appendTo(".category_numbers");	
	});
	
    $( "#startdate_input" ).datepicker();
	$( "#enddate_input" ).datepicker();
	
	$("#startdate_input,#enddate_input").change(function() {
			updateChart();
	});
	
	
	$("article h1[name='global_stats'] + section section a").click(function() {
			
			if($(this).attr("id")=="cumul"){
				if($(this).hasClass("selected")){
					$(this).removeClass("selected");
					$(this).html("Cumulative");
					
					}
				else {
				$(this).html("Per period");
				
				$(this).addClass("selected");
				}
			}else{
				
					
			if($(this).hasClass("selected"))
				$(this).removeClass("selected");
			else $(this).addClass("selected");
			}
			updateChart();
			
	});
	setInterval(updateGlobalStats,7200000);	
	$("article h1[name='venues_stats'] + section section a").click(function() {
	
		$("article h1[name='venues_stats'] + section section a").removeClass("selected");
		if($(this).hasClass("selected"))
				$(this).removeClass("selected");
			else $(this).addClass("selected");
		map.setCenter(new google.maps.LatLng(47.510, 2.217));
		map.setZoom(map.getZoom()-1);
		mc.setMap(null);
	});
}

function updateGlobalStats(){
	notify("info","Updating Stats");
	$(".global_numbers").html("");
	getCount("lode:Event","Total Events").appendTo(".global_numbers");
	getCountUnion("<http://www.w3.org/ns/ma-ont#Image>","<http://www.w3.org/ns/ma-ontImage>","Total Photos").appendTo(".global_numbers");
	getCount("foaf:Agent","Total Agents").appendTo(".global_numbers");
	getCount("dul:Place","Total Venues").appendTo(".global_numbers");
	getCount("foaf:Person","Total Users").appendTo(".global_numbers");
	updateChart();
	notify("info","Stats updated");
}