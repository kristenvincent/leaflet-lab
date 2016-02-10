//leaflet tutorials document

//Quick Start tutorials
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
	.setLatLong([51.5, -0.09])
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
