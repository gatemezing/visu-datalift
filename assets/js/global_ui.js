//GLOBAL VAR
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var server  = "http://eventmedia.eurecom.fr/scrap/";
var map;
var updateProcessesInterval;

//Connection Var
var should_connect = true;
var ajax_timeout = 5000;
var interval_progress = 6000;

$(function() {
////INITIALIZE
	initialize();
//INIT MAIN ARTICLE VISIBLE
	$("article h1").hide();
	$("article > section").hide();	
	$("article h1.first").show();	
	$("article h1.first + section").show();


 // $("#top_menu_global").hide();
// RESIZE ELEMENTS IN THE PAGE
	resizeElements();
	$(window).resize(function() {
		resizeElements();
	});

//////EVENTS MAPPING	
// TOP MENU BUTTONS
	$('#top_menu_global li').click(function() {
			//$("#top_menu_sub").hide();
			$("#top_menu_sub ul").hide();
			//console.log($(this).attr("name"));
			if("collect".indexOf($(this).attr("name"))!= -1 )
			{	
				$("#top_menu_sub ul[name='"+$(this).attr("name")+"']").show();
				$("#top_menu_sub").show();
			} else $("#top_menu_sub").hide();
			$('#top_menu_global li').removeClass("current");
			$(this).addClass("current");
			
	});
	
// TOP SUB MENU BUTTONS
	$('#top_menu_sub li').click(function() {
			$("#top_menu_sub").hide();
			//$("#top_menu_global").hide();
			resizeElements();
	});
	
// LEFT MENU BUTTONS
	$('#left_nav a').click(function() {		
			$("article h1").hide();
			$("article > section").hide();	
			$("article h1[name='"+$(this).attr("name")+"']").show();	
			$("article h1[name='"+$(this).attr("name")+"'] + section").show();	
			$('#left_nav li').removeClass("current");
			$(this).parent().addClass("current");
			if($(this).attr("name")=="venues_stats")
				initializeMap();
	});
	
	

	// NOTIFICATIONS
	$('.overlay .show_menu').click(function() {			
			$("#top_menu_global").toggle();
	});
	$('.notification').live("click", function(){			
			$(this).remove();
	});	
});



function resizeElements()
{
 var top_bar = $("#top_header + header").height();
if(!$("#top_header + header").is(":visible"))
	top_bar = 0;
 var height = $(window).height();
 var headers_height = $("#top_header").height() + top_bar;
 var elements_height = height - headers_height;
  $("#elements_layout").css("height",elements_height+"px");
 $("article").css("height",elements_height+"px");

 //notify("info","Window Resized");
}

function notify (level,message){
var li=document.createElement("li");
li.setAttribute("class","notification " + level);

var close = document.createElement("div");
close.setAttribute("class","close");
close.setAttribute("style","background-position: -32px -193px; float:right;");
li.appendChild(close);

var img = document.createElement("img");
img.setAttribute("src","img/"+level+".png");
li.appendChild(img);

var a = document.createElement("a");
a.innerHTML=message;
li.appendChild(a);

var $li = $(li);

$li.appendTo($(".overlay ul")).hide();

$li.fadeIn(100).delay(3000).fadeOut(1000, function() { $(this).remove(); });

}
function connectionError(){
notify ("error","Connection Error REST");
clearInterval(updateProcessesInterval);
notify ("info","<button onclick='clearInterval(updateProcessesInterval);updateProcessesInterval = setInterval(updateProgress,3000);'>Retry</button>");
}

