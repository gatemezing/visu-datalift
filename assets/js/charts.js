 
      function drawVisualization(startDate,endDate,types,labels,cumul) {
  // Create and populate the data table.
  var data = google.visualization.arrayToDataTable(getValuesFromDates(startDate,endDate,types,labels,cumul));
  

  // Create and draw the visualization.
  new google.visualization.LineChart(document.getElementById('global_visualization')).
      draw(data, {width: $('#global_visualization').width(), height: 400,
                  vAxis: {maxValue: 10}}
          );
}


   
	  
	  
	  
function getValuesFromDates(startDate,endDate,types,labels,cumul){	
	
	var dates = getDatesArray(startDate,endDate);
	var format=dates[dates.length-1];
	var loops = Math.floor((dates.length-2)/25);
	if((dates.length-2)%25==0)
		loops=loops-1;
	var index= ['x'];
	for(var i=0 ; i<types.length;i++)
	{
		index.push(labels[i]);	
	}
	var chart_array=[index];
	var typesArray=[];
	for(var t = 0 ;t<types.length;t++)
	{
		var typeArray = [];
		for(var j=0;j<=loops;j++)
		{	
			var union="";
			var header="select ";
			var count = 0;
			var num = 25;
			if(j==loops)
				num = dates.length-1 - 25*loops;
			for(var i=25*j;i<25*j+num-1;i++)
			{	
				var curr_date = getXSDDate(dates[i]);
				var next_date = getXSDDate(dates[i+1]);
				header+= " count(distinct ?s"+count+") ";
				var min="";
				if(!cumul)
					min="filter(?datetime"+count+" > '"+curr_date+"+02:00'^^xsd:dateTime)";
				union+="{ ?s"+count+" a "+types[t]+".  ?s"+count+" dc:issued ?datetime"+count+". "+min+" filter(?datetime"+count+" < '"+next_date+"+02:00'^^xsd:dateTime) } union";	
				count++;
			}
			union = union.slice(0,union.length-5);
			header+=" where{ ";
			
			var query_count = header +union + " }";	
			var json=sparqlQuery(query_count, "http://eventmedia.eurecom.fr/sparql/");	
			var res = json.results.bindings;		
			
			for(var k=0;k<num-1;k++)
			{
				typeArray.push(parseInt(res[0]["callret-"+k]['value']));
			}
		}
		typesArray.push(typeArray);
	}
	for(var j=0;j<dates.length-1;j++)
	{
	    var cell =[];
		cell.push(dateToString(dates[j],format));
		for(var t = 0 ;t<typesArray.length;t++)
		{
			cell.push(typesArray[t][j]);		
		}
		chart_array.push(cell);
	}
	
	return chart_array;
	
	
}
	
	function dateToString(date,format){
	    var dateString ="";
		switch(format){
			case "hour":				
				if(date.getHours() == 0 && date.getMinutes==0)
					dateString+=date.toDateString()+" ";
				dateString+=getHour(date);
				return dateString;
			case "day":
				dateString+=months[date.getMonth()]+" " +	date.getDate();
				return dateString;
			case "month":
				dateString+=months[date.getMonth()]+" " +	date.getFullYear();
				return dateString;
		}
		
	
	}
	

	function getDatesArray(startDate,endDate){
		var array =[];			
        
		var curr_day = startDate;
		
		var diff = (endDate - startDate)/86400000;
		if(diff <1)
		{
			var curr_day=new Date();
			curr_day.setHours(curr_day.getHours()-1);
			var endDate=new Date();

			array.push(curr_day);
			while(curr_day <endDate){				
				var nextDate = new Date(curr_day);				
				nextDate.setMinutes(nextDate.getMinutes()+1);
				array.push(nextDate);								
				curr_day= nextDate;
			}
			array.push("hour");
		}
		else if(diff <=3)
		{
			array.push(curr_day);
			while(curr_day <endDate){
				var nextDate = new Date(curr_day);
				nextDate.setHours(nextDate.getHours()+1);							
				array.push(nextDate);
				curr_day= nextDate;
			}
			array.push("hour");
			
		}else if (diff >72){
			array.push(curr_day);
			while(curr_day <endDate){
				var nextDate = new Date(curr_day);
				nextDate.setMonth(nextDate.getMonth()+1);
				array.push(nextDate);
				curr_day= nextDate;
			}
			array.push("month");
		
		}
		else
		{
			array.push(curr_day);
			while(curr_day <endDate){
				var nextDate = new Date(curr_day);
				nextDate.setDate(nextDate.getDate()+1);
				var curr_s_d = getXSDDate(curr_day);
				var curr_e_d = getXSDDate(nextDate);			
				array.push(nextDate);
				curr_day= nextDate;
			}
			array.push("day");
		
		}		
					
		return array;
	}
	
	
	
	function getDaysNumber(date){
		return new Date(date.getFullYear(), date.getMonth()+1, -1).getDate()+1;
	}
	
	function getHour(date){
		var a_p = "";
		
		var curr_hour = date.getHours();

		if (curr_hour < 12)
		   {
		   a_p = "AM";
		   }
		else
		   {
		   a_p = "PM";
		   }
		if (curr_hour == 0)
		   {
		   curr_hour = 12;
		   }
		if (curr_hour > 12)
		   {
		   curr_hour = curr_hour - 12;
		   }

			var curr_min = date.getMinutes();
			curr_min = curr_min + "";

			if (curr_min.length == 1)
			{
				curr_min = "0" + curr_min;
			}
			return curr_hour + ":" + curr_min + "" + a_p;
	}
	function getXSDDate(curr_day){
		return curr_day.getFullYear()+"-"+(curr_day.getMonth()+1)+"-"+curr_day.getDate()+"T"+curr_day.getHours()+":"+curr_day.getMinutes()+":"+curr_day.getSeconds();
	}
	
	function updateChart()
	{
		var types=[];
		var labels=[];
		var $types= $("article h1[name='global_stats'] + section section a.selected[type]");
		$.each($types,function(index,value){
			
			types.push($(value).attr("type"));
			labels.push($(value).html());
		});
		drawVisualization(new Date($("#startdate_input").val()), new Date($("#enddate_input").val()),types,labels,!$("#cumul").hasClass("selected"));
		
	
	}