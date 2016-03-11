
/*
*
*   MAP
*
*/
function buildMap(id_map) {
    var mapbox = {
        idMapStreet: "imleo.o2ppnpfk",
        idMapBlack: "imleo.o439ljf3",
        token: "pk.eyJ1IjoiaW1sZW8iLCJhIjoiT0tfdlBSVSJ9.Qqzb4uGRSDRSGqZlV6koGg"
    };
    /*global L*/
    var map = L.map(id_map).setView([19.4284700, -99.1276600], 12); 
    
    L.tileLayer('https://api.tiles.mapbox.com/v4/' + mapbox.idMapBlack + '/{z}/{x}/{y}.png?access_token=' + mapbox.token, {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    $("#" + id_map).height( $(window).height() );
    map.invalidateSize();
    
    return map;
}
    