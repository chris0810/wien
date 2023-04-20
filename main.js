/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom"
};

// Karte initialisieren
let map = L.map("map").setView([
    stephansdom.lat, stephansdom.lng
], 12);
//thematische Layer
let themaLayer = {
    stops: L.featureGroup().addTo(map),
    lines: L.featureGroup(),
    zones: L.featureGroup(),
    sites: L.featureGroup(),

}
// Hintergrundlayer
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau").addTo(map),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay")
},{
    "Vienna Sightseeing Haltestellen": themaLayer.stops,
    "Vienna Sightseeing Routes": themaLayer.lines,
    "Fußgängerzonen": themaLayer.zones,
    "Sites": themaLayer.sites,
}
).addTo(map);

// Marker Stephansdom
L.marker([
    stephansdom.lat, stephansdom.lng
]).addTo(map).bindPopup(stephansdom.title).openPopup();

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

async function showStops (url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata,{
        onEachFeature: function(feature , layer){
            let prop= feature.properties;
            //layer.bindPopup(prop.LINE_NAME);
            layer.bindPopup(`
            <img src="${prop.THUMBNAIL}" alt="*">
            <h4>${prop.LINE_NAME}</h4>
            `);
            console.log(feature.properties, prop.LINE_NAME);
        }
    }
        ).addTo(themaLayer.stops)
    //console.log (response, jsondata)
}
showStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")

async function showLines (url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata).addTo(themaLayer.lines)
    //console.log (response, jsondata)
}

showLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
async function showSights (url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata).addTo(themaLayer.sights)
    //console.log (response, jsondata)
}
showSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")

async function showZones (url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata).addTo(themaLayer.zones)
    //console.log (response, jsondata)
}
showZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")
//https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json