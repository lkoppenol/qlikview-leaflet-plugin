BASE_HTML = "<div id='leaflet_map' style='height: 100%; width: 100%'></div>";
PAGE_LENGTH = 50
var tile_layer
var map
var feature_group

function hasInvalidData(data){
    return data.HeaderRows[0].length < 3;
}

function init(document){
    document.Element.innerHTML = BASE_HTML;
    map = L.map('leaflet_map');
    tile_layer.addTo(map);
    document.Data.SetPagesizeY(PAGE_LENGTH);
    feature_group = L.featureGroup([]);
    feature_group.addTo(map);
}

function rowToMarker(row){
    lat = row[0].text;
    lon = row[1].text;
    return L.marker([lat, lon]);
}

function popupText(headerRow, row){
    content = [];
    for (var j = 2; j < headerRow.length; j++){
        content.push("<b>" + headerRow[j].text + ":</b> " + row[j].text)
    }
    return content.join("<br>");
}

function resizeMap(){
    if (feature_group.getLayers().length > 0) {
        map.fitBounds(feature_group.getBounds());
    }    
}

function createMarkers(data){
    for (var i = 0; i < data.Rows.length; i++) { 
        marker = rowToMarker(data.Rows[i])
        popup_content = popupText(data.HeaderRows[0], data.Rows[i])
        marker.bindPopup(popup_content)
        feature_group.addLayer(marker);
    }    
}

function loadTileLayer(){
    tile_layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox-id',
        accessToken: 'mapbox-access-token'
    });    
}

paint = function(){
    loadTileLayer()
    if (hasInvalidData(this.Data)){
        return;
    }
    if (this.Element.innerHTML == ""){
       init(this);
    } else {
       feature_group.clearLayers();
    }
    createMarkers(this.Data)
    resizeMap()
}

Qva.LoadCSS("http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css");
Qv.LoadExtensionScripts(["https://npmcdn.com/leaflet@1.0.0-rc.3/dist/leaflet.js"], function() {
    Qv.AddExtension('LeafletJs', paint);
});
