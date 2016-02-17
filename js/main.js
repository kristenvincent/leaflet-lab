//Kristen Vincent's Leaflet Katrina map


//GOAL: Proportional symbol map for an attribute of the data
//STEPS:
//1. Create the Leaflet map
//2. Import GeoJSON
//3. Add circle markers for weather stations
//4. Pick attribute to visualize (rainfall every 3 hours)
//5. Determine the value for the selected feature
//6. Give each feature's circle marker a radius based on the chosen attribute value

//Step 1. Create the Leaflet map
//defining a function to create the map
function createMap() {
//creating a variable called map that initializes our map, with zoom level and map center set
	var map = L.map('map').setView([30, -88], 7);
	
	//Here, the tile layer (base map) is set and added to the map
	L.tileLayer('http://b.tiles.mapbox.com/v4/nps.68926899,nps.502a840b/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibnBzIiwiYSI6IkdfeS1OY1UifQ.K8Qn5ojTw4RV1GwBlsci-Q', {
		maxZoom: 14,
		attribution: 'Imagery from <a href="http://www.nps.gov/npmap/tools/park-tiles">National Park Service Park Tiles</a><a href="http://www.nps.gov</a>'
	}).addTo(map);

	//getData function is called to get the data for the map element
	getData(map);
};

//Step 2. Add data
//creating a function to load in data from MegaCities.geojson using jquery ajax method
function getData(map) {
	$.ajax("data/575Lab1Data.geojson", {
		dataType: "json",
		success: function (response) {
			//call function to create proportional symbols
			createPropSymbols(response, map);
		}		
	});
};

function calcPropSymbolRadius(attValue) {
	//scale factor to adjust symbol size evenly
	var scaleFactor = 1000;
	//area based on attribute value and scale factor
	var area = attValue * scaleFactor;
	//radius is calculated based on circle area
	var radius = Math.sqrt(area/Math.PI);

	return radius;
};

//function to convert markers to circle markers
function pointToLayer (feature, latlng) {
//Step 4. Choose attribute to visualize
	var attribute = "12to3am";
	//marker style options are set to a variable
	var geojsonMarkerOptions = {
		radius: 8,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};
	//Step 5. For each feature, determine its value for the selected attribute
	var attValue = Number(feature.properties[attribute]);

	//Step 6. Give circle marker a radius based on attribute value
	geojsonMarkerOptions.radius = calcPropSymbolRadius(attValue);

	//creating the circle marker layer
	var layer = L.circleMarker(latlng, circleMarkerOptions);

	//build popup content string
	var popupContent = "<p><b>Weather Station:</b>" + feature.properties.stationName + "</p><p><b>" + ":<b>" + feature.properties[attribute] + "</p>";

	//bind the popup to the marker
	layer.bindPopup(popupContent);

	//return the marker to the L.geoJson pointToLayer option
	return layer;
};

//Step 3. Make circle markers
function createPropSymbols(data, map) {
	//geoJSON layer with leaflet is created and added to the map
	L.geoJson(data, {
		//pointToLayer is used to change the marker features to circle markers, 
		//styled with geojsonMarkerOptions
			pointToLayer: pointToLayer
	}).addTo(map);
};

//*****LEFT OFF ON EXAMPLE 2.1*****//

//when the DOM is ready, createMap is called 
$(document).ready(createMap);
