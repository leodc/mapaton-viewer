/**
 * Part of this JavaScript file was taked from: http://datos.mapatoncd.mx/
 * */


var RESPONSE_MAX_OBJECT = 20;     //Objects per page
var MAX_POINTS_PER_TRAIL = 1000;   //Points per page... all the points please

//Counters
var total_trails = 0;
var total_points = 0;


//Map layers
var group_api_layer;
var valid_routes = 0;

/**
 * This method is called when the google client js has been loaded on the client page.
 */
function initMap(){
    gapi.client.load("dashboardAPI", "v1", function() {
        var map = buildMap("map");
        group_api_layer = addGroupLayer(map);
        getAllTrails('');
        
        $( window ).resize(function() {
            $("#map").height( $(window).height() );
            map.invalidateSize();
        });
    }, "https://mapaton-public.appspot.com/_ah/api");
}



/**
 * This method will fetch and parse the trails from the mapaton API.
 * @param cursor the current cursor for pagination, can be an empty string if it is the first page
 */
function getAllTrails(cursor){
    gapi.client.dashboardAPI.getAllTrails({
    	numberOfElements: RESPONSE_MAX_OBJECT,
    	cursor: cursor
    }).execute(function (resp) {
        if( 'undefined' === typeof resp.error ){
            if(resp.trails){
                total_trails += resp.trails.length;
                
                //More data to process
            	for( var i = 0; i < resp.trails.length; i++ ){ 
                    var trail = getGeometricTrail( resp.trails[i] );
                    
                    if( trail !== null ){
                        paintAllRawPoints(trail);
                    }
                }
                
                //recursivity
                getAllTrails(resp.cursor);
            }
        } else {
            console.log("Error getting the trails.");
            console.log(resp);
        }
    });
}



/**
 * This method will fetch and parse the trails from the mapaton API.
 * @param cursor the current cursor for pagination, can be an empty string if it is the first page
 */
 function paintAllRawPoints( trail ){
     gapi.client.dashboardAPI.getTrailRawPoints({
        trailId: trail.id,
	    numberOfElements: MAX_POINTS_PER_TRAIL,
    	cursor: ''
    }).execute(function (resp) {
        if( 'undefined' === typeof resp.error ){
            //New Polyline Layer (?)
            //Maybe one MultyPolyLine Layer for all the trails (?)
            var style = {
                weight: 2,
                opacity: 0.9,
                color: getRandomColor()
            };
            
            var polyline = L.polyline([], style);
            group_api_layer.addLayer(polyline);
            var popup = buildPopup(trail);
            
            if(resp.points){
                total_points += resp.points.length;
                
                //More data to process
            	for( var i = 0; i < resp.points.length; i++ ){
            	    var point_location = resp.points[i].location;
            	    
            	    var latlngs = {lat: point_location.latitude, lng: point_location.longitude};
            	    polyline.addLatLng( latlngs );
                }
                
                polyline.bindPopup(popup);
            }
        } else {
            console.log("Error getting the trails.");
            console.log(resp);
        }
    });
 }


/**
 * function to make a date human readable
 * @param date {Date}
 * @returns {String}
 */
function dateString(date){
	if(date === 'undefined' || date == null){
		return "";
	}
	var months = ['enero', 'febrero', 'marzo', 
	              'abril', 'mayo', 'junio',
	              'julio', 'agosto', 'septiembre',
	              'octubre', 'noviembre', 'diciembre'];
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	return day + ' de ' + months[monthIndex] + ' de ' + year;
	
}


function getGeometricTrail( tempTrail ){
    var trail = {};
    
    trail.origin = tempTrail.originStationName;
    trail.destination = tempTrail.destinationStationName;
    trail.transportType = tempTrail.transportType;
    trail.id = tempTrail.trailId;
    trail.status = tempTrail.trailStatus;
    
    
    if(tempTrail.schedule){
        trail.schedule = tempTrail.schedule;
    }
    
    if(tempTrail.branchName){
        trail.branch = tempTrail.branchName;
    }


    //Set a human readable date for the trail
    if(tempTrail.revisionDate){
    	trail.revisionDate = dateString(new Date(tempTrail.revisionDate)) ;
    }else{
    	trail.revisionDate = 'Sin revisión';
    }


    //Set a human readable status for the trail;
    switch(tempTrail.trailStatus){
    	case 0:
    	    valid_routes++;
        	trail.trailStatus = "Válido";
        	break;
        case 1:
        	trail.trailStatus = "Inválido, recorrido corto";
        	break;
        case 2:
        	trail.trailStatus = "Inválido, recorrido fuera de tiempo";
        	break;
    	default:
    		trail.trailStatus = "Inválido";
    		return null;
    }
    
    return trail;
}



function getRandomColor(){
    var rgb = [];

    for(var i = 0; i < 3; i++)
        rgb.push(Math.floor(Math.random() * 255));

    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}



function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


function buildPopup(trail){
    var html = "<b>" + trail.transportType + "</b> ";
    html += "<i style='color:gray'>(" + trail.id + ")</i><br><br>";
    html += "<b>Origen:</b> " + trail.origin + "<br>";
    html += "<b>Destino:</b> " + trail.destination + "<br>";
    html += "<b>Estatus:</b> " + trail.trailStatus;
    
    return html;
}


 /*
    global gapi
    global buildMap
    global L
    global addGroupLayer
    global $
  */
  