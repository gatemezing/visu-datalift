function updateLocalStorage(){

	$.ajax({
		url: server+"progress?format=json",
		dataType: "text",
		success: function(data) {
			var events = new Array();
			var media = new Array();
			var json = JSON.parse(data);
			for(var i=0;i<json.processes.length;i++)
			{
				switch(json.processes[i].progress.request.type)
				{
					case "events":
						events.push(json.processes[i].progress);
						break;	
					case "photos":
						media.push(json.processes[i].progress);
						break;	
				}		
			}
			localStorage.setItem("e_processes",JSON.stringify(events));
			localStorage.setItem("m_processes",JSON.stringify(media));
		},
		timeout: ajax_timeout,
		error: function(){
			connectionError();
		}
	});	
	
	$.ajax({
		url: server+"log?format=json",
		dataType: "text",
		success: function(data) {
			localStorage.setItem("log",data);			
		}
	});	
		
}

function showLog(){
	var max_mess = getmaxmessages();
	//$(".widget[name='console_log'] ul").html("");
	var str = localStorage.getItem("log");
	var data = jQuery.parseJSON(str);
	var last_id=localStorage.getItem("log_last_id");	
	if(last_id == null)
		last_id="0_0";
	last_id = last_id.split('_');
	var log_last_id = "0_0";
	var serie = data[0].id.split('_')[0];
	var start=0;
	if(last_id[0] = serie)  start = last_id[1];
	for(var i=start;i<data.length;i++){
		var curr_id = data[i].id.split('_');
		if(parseInt(curr_id[0]) >= parseInt(last_id[0])){
			if(parseInt(curr_id[1]) > parseInt(last_id[1])){
				var html = "<p>"+data[i].message+"</p>";
				var li = document.createElement("li");
				li.setAttribute("class","l_"+data[i].level);
				li.innerHTML = html;
				var mess_count = $("h1[name='console_log'] + section  ul.log li").length;
				if(mess_count >= max_mess)
					$("h1[name='console_log'] + section  ul.log > li").remove();
				$(li).appendTo("h1[name='console_log'] + section  ul.log");			
			}		
		}
		log_last_id = curr_id[0]+"_"+curr_id[1];
	}
	localStorage.setItem("log_last_id",log_last_id);
	updatelog();
}


function getGoneProcessesStatus(ids,type){
	for(var i=0;i<ids.length;i++){
	    
		if($(".process_status[guid='"+ids[i]+"']").attr("uptodate")=="false" )
		{
			if($(".process_status[guid='"+ids[i]+"']").attr("finished")!="true"){
				$.getJSON(server+"archives/collect?id="+ids[i]+"&format=json",  function(json) {
					var p = json;
					var id = p.request.id;
					var curr_proc = $("article section[guid='"+id+"'].current_process");
					curr_proc.children(".to").html("<h5>"+p.total_objects+"</h5><p>Total "+type+"</p>");
					curr_proc.children(".oc").html("<h5>"+p.objects_collected+"</h5><p>Collected</p>");
					curr_proc.children(".eo").html("<h5>"+p.existing_objects+"</h5><p>Not Collected</p>");
					curr_proc.children("section").children(".progress_bar").children(".adrift").css("width",p.progress+"%");
					curr_proc.children("section").children(".progress_bar").addClass(p.status);
					curr_proc.children("section").children(".progress_bar").addClass(p.status);
					curr_proc.children("section").children(".status").attr("class","status "+p.status).html(p.status);
					
					//update proc log
					var $curr_log = $(".curr_proc_log + section[guid='"+id+"'] .log");
					$curr_log.html("");
					for(var j=0;j<p.messages.length;j++){		
						var mess = 	p.messages[j];			
						var html = "<p>"+mess.message+"</p>";
						var li = document.createElement("li");
						li.setAttribute("class","l_"+mess.level);
						li.innerHTML = html;
						$(li).appendTo($curr_log);			
					}
				
					$(".process_status[guid='"+id+"'] .adrift").css("width",p.progress_percent+"%");
					$(".process_status[guid='"+id+"'] .progress_bar").attr("class","progress_bar " +p.status);
					$(".process_status[guid='"+id+"']").attr("finished","true");
					
					$("#processes_status .terminated").after($(".process_status[guid='"+id+"']"));
					
					
					//TODO ADD BY SOURCE
				});				
			}
		}	
	}
}

function stop_process(id){
if(id == null)
	$.ajax({
		url: server+"process.stop",
		dataType: "text",
		success: function(data) {
					
		}
	});	
else
	$.ajax({
		url: server+"process.stop?id="+id,
		dataType: "text",
		success: function(data) {
					
		}
	});	
}

