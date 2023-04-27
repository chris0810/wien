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
], 15);
    map.addControl(new L.Control.Fullscreen());
//thematische Layer
let themaLayer = {
    stops: L.featureGroup(),
    lines: L.featureGroup(),
    zones: L.featureGroup(),
    sights: L.featureGroup().addTo(map),

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
    "Sites": themaLayer.sights,
}
).addTo(map);

// Marker Stephansdom
//L.marker([
//    stephansdom.lat, stephansdom.lng
//]).addTo(map).bindPopup(stephansdom.title).openPopup();

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Vienna Sightseeing Haltestellen

async function showStops(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata).addTo(themaLayer.stops)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, {
            pointToLayer: function(feature, latlng) {
                
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: 'icons/bus.png',
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37],
    
                    })
                });
            },

        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h4><i class="fa-solid fa-bus-simple"></i><a>&ensp;</a></i>${prop.LINE_NAME}</h4>
            <address>${prop.STAT_ID}&ensp;${prop.STAT_NAME}</address>
            `);
            //console.log(feature.properties, prop.LINE_NAME);

        }
    }).addTo(themaLayer.stops);

}

showStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");


async function showLines(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    let lineNames={};
    let lineColors={ //https://clrs.cc/
        1: "#FF4136", //Red Line', 
        2: "#FFDC00",//Yellow Line',
        3: "#0074D9",//Blue Line',
        4: "#2ECC40",//Green Line',
        5: "#AAAAAA",//Grey Line',
        6: "#FF851B",//Orange Line'

    }
    L.geoJSON(jsondata).addTo(themaLayer.lines)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, {
        style: function (feature) {
            return {color: lineColors[feature.properties.LINE_ID],
                weight: 3,
                dashArray:[10, 6]

            };
            
        },
        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h4><i class="fa-solid fa-bus-simple"></i><a>&ensp;</a></i>${prop.LINE_NAME}</h4>
            <address><i class="fa-solid fa-circle-stop"></i>${prop.FROM_NAME}</address>
            <i class="fa-solid fa-arrow-down"></i>
            <address><i class="fa-solid fa-circle-stop"></i>${prop.TO_NAME}</adress>
            `);
            //console.log(feature.properties, prop.LINE_NAME);
            lineNames[prop.LINE_ID]=prop.LINE_NAME;
            //console.log(lineNames)
        }
    }).addTo(themaLayer.lines);
}

showLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");


async function showSights(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata).addTo(themaLayer.sights)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
            
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'icons/photo.png',
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],

                })
            });
        },
        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <img src = "${prop.THUMBNAIL}" alt = "*")>
            <h4><a ref = "${prop.WEITERE_INF}" target = "Wien">${prop.NAME}</a></h4>
            <address>${prop.ADRESSE}</address>
            `);
            //console.log(feature.properties, prop.NAME);
        }
    }).addTo(themaLayer.sights);
}

showSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");


async function showZones(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata).addTo(themaLayer.zones)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, {
            style: function (feature) {
                return {
                color: "#F012BE",
                weiht:1,
                fillColor: "#F012BE",
                fillOpacity:0.4,
                opacity:0.1,
                
                


                
                    
    
                };
            },
        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h4>Fußgängerzone<a>&ensp;</a></i>${prop.ADRESSE}</h4>
            <p><i class="fa-regular fa-clock"></i>&ensp;${prop.ZEITRAUM || "dauerhaft"}</p>
            <p><i class="fa-sharp fa-solid fa-circle-info"></i>&ensp;${prop.AUSN_TEXT|| "keine Ausnahmen"}</p>
            `);
            //console.log(feature.properties, prop.ADRESSE);
        }
    }).addTo(themaLayer.zones);
}

showZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");