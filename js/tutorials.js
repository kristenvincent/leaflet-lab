//leaflet tutorials document

//Quick Start tutorial
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map);

var circle = L.circle([51.508, -0.11], 500, {
	color: 'red',
	fillColor: '#fo3',
	fillOpacity: 0.5
}).addTo(map);

var polygon = L.polygon([
	[51.509, -0.08],
	[51.503, -0.06],
	[51.51, -0.047]
]).addTo(map);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
	.setLatLng([51.5, -0.09])
	.setContent("I am a standalone popup.")
	.openOn(map);

function onMapClick(e) {
	alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

var popup = L.popup();

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
}

map.on('click', onMapClick);

//GeoJSON with Leaflet tutorial
var geojsonFeature = {
	"type": "Feature",
	"properties": {
		"name": "Coors Field",
		"amenity": "Baseball Stadium",
		"popupContent": "This is where the Rockies play!"
	},
	"geometry": {
		"type": "Point",
		"coordinates": [-104.99404, 39.75621]
	}
};

L.geoJson(geojsonFeature).addTo(map);

var myLines = [{
	"type": "LineString",
	"coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
	"type": "LineString",
	"coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myLayer = L.geoJson().addTo(map);
myLayer.addData(geojsonFeature);

var myStyle = {
	"color": "#ff7800",
	"weight": 5,
	"opacity": 0.65
};

L.geoJson(myLines, {
	style: myStyle
}).addTo(map);

var states = [{
	"type": "Feature",
	"properties": {"party": "Republican"},
	"geometry": {
		"type": "Polygon",
		"coordinates": [[
			[-104.05, 48.99],
			[-97.22, 48.98],
			[-96.58, 45.94],
			[-104.03, 45.94],
			[-104.05, 48.99]
		]]
	}
}, {
	"type": "Feature",
	"properties": {"party": "Democrat"},
	"geometry": {
		"type": "Polygon",
		"coordinates": [[
			[-109.05, 41.00],
			[-102.06, 40.99],
			[-102.03, 36.99],
			[-109.04, 36.99],
			[-109.05, 41.00]
		]]
	}
}];

L.geoJson(states, {
	style: function(feature) {
		switch (feature.properties.party) {
			case 'Republican': return {color: "#ff0000"};
			case 'Democrat': return {color: "#0000ff"};
		}
	}
}).addTo(map);

var geojsonMarkerOptions = {
	radius: 8,
	fillColor: "#ff7800",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.8
};

//This is where I am stuck. 
L.geoJson(geojsonFeature, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptions);
	}
}).addTo(map);

function onEachFeature(feature, layer) {
	//does this feature have a property named popupContent?
	if (feature.properties && feature.properties.popupContent) {
		layer.bindPopup(feature.properties.popupContent);
	}
}

var geojsonFeature = {
	"type": "Feature",
	"properties": {
		"name": "Coors Field",
		"amenity": "Baseball Stadium",
		"popupContent": "This is where the Rockies play!"
	},
	"geometry": {
		"type": "Point",
		"coordinates": [-104.99404, 39.75621]
	}
};

L.geoJson(geojsonFeature, {
	onEachFeature: onEachFeature
}).addTo(map);

//Busch Field will not be shown on the map
var someFeatures = [{
	"type": "Feature",
	"properties": {
		"name": "Coors Field",
		"show_on_map": true
	},	
	"geometry": {
		"type": "Point",
		"coordinates": [-104.99404, 39.75621]
	}
}, {
	"type": "Feature",
	"properties": {
		"name": "Busch Field",
		"show_on_map": false
	},	
	"geometry": {
		"type": "Point",
		"coordinates": [-104.98404, 39.74621]
	}
}];

L.geoJson(someFeatures, {
	filter: function(feature, layer) {
		return feature.properties.show_on_map;
	}
}).addTo(map);
