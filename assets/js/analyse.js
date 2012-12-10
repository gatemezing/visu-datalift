 var geoval;
 var istime;
  
  function setEndPoint(value){
  endpoint=value;
  
  }
 
 //function for analyse datesets
  function analyse()
 {
 $("#geodata").html("");
 geoval = hasGeoData()
  if (geoval) {
	  $("#geodata").append("<div class='alert alert-success'<p>Geodata is present</p></div>");
      }
	  else 
        $("#geodata").append("<div class='alert alert-error'><p>Geodata is NOT present</p></div>");
		
 //$("#time").html("<td>"+istime+"</td>") 

  }
  
  
  function hasGeoData()
   {
     var query_ask = "ask where {?x a ?c. ?c a ?class. ?x ?p ?o. filter(?class=owl:Class || ?class=rdfs:Class) filter(?p=geo:lat || ?p=geo:long)} ";
     var json=sparqlQuery(query_ask, "http://dbpedia.org/sparql/");  
    var res = json.boolean;  
     geoval = res;
     return geoval;
   //console.log(geoval);
   }

 function hasTime()
 {
  
 var query_ask="prefix time: <http://www.w3.org/2006/time#>ask where {?x a ?c.?c a ?class. ?x ?p ?o. filter(?class=time:TemporalEntity || ?class=time:Instant || ?class=time:Interval)filter(?p=time:duration || ?p=time:hasBeginning)}";
   var json=sparqlQuery(query_ask, "http://dbpedia.org/sparql/");  
    var res = json.boolean;  
     istime = res;
    return istime;
	
     //alert("Il ya des données temporelles? " +istime);
	// console.log(istime)
  }

  function hasSkos()
  {
  var query_ask="prefix skos: <http://www.w3.org/2004/02/skos/core>ask where {?x a ?c. ?c a ?class. ?x ?p ?o. filter(?class=skos:Concept || ?class=skos:ConceptScheme || ?class=skos:Cllection ) filter(?p=skos:featureCode || ?p=skos:altLabel || ?p=skos:prefLabel  || ?p=skos:relatedMatch)}";
   var json=sparqlQuery(query_ask, "http://dbpedia.org/sparql/");
   var res= json.boolean;
    isSkos= res;
	return isSkos;
  }
