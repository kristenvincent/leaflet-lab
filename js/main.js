//Kristen Vincent's Leaflet Hurricane Katrina map

//function to create the map
function createMap() {
//creating a variable called map that initializes our map, with zoom level and map center set
	var map = L.map('map', {
		center: [31, -89],
		zoom: 6,
		minZoom: 4
	});
	
	//Here, the tile layer (base map) is set and added to the map
	var basemap = L.tileLayer('http://b.tiles.mapbox.com/v4/nps.68926899,nps.502a840b/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibnBzIiwiYSI6IkdfeS1OY1UifQ.K8Qn5ojTw4RV1GwBlsci-Q', {
		maxZoom: 12,
		attribution: 'Imagery from <a href="http://www.nps.gov/npmap/tools/park-tiles">National Park Service Park Tiles</a><a href="http://www.nps.gov</a>'
	}).addTo(map);

	//getData function is called to get the data for the map element
	getData(map);
	getOverlayData(map);
	
};

//Make circle markers
function createPropSymbols(data, map, attributes) {
	//geoJSON layer with leaflet is created and added to the map
	L.geoJson(data, {
		//pointToLayer is used to change the marker features to circle markers, 
		//styled with geojsonMarkerOptions
		pointToLayer: function(feature, latlng){
			return pointToLayer(feature, latlng, attributes);
		}
	}).addTo(map);
	updatePropSymbols(map, attributes[0]);
 };

//function to convert markers to circle markers
function pointToLayer (feature, latlng, attributes) {
	//Assign attribute based on index
	//Choose attribute to visualize
	var attribute = attributes[0];
	//marker style options are set to a variable
	var geojsonMarkerOptions = {
		radius: 8,
		fillColor: "#27AAC9",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};
	//For each feature, determine its value for the selected attribute
	var attValue = Number(feature.properties[attribute]);

	//Give circle marker a radius based on attribute value
	geojsonMarkerOptions.radius = calcPropSymbolRadius(attValue);

	//creating the circle marker layer
	var layer = L.circleMarker(latlng, geojsonMarkerOptions);

	//return the marker to the L.geoJson pointToLayer option
	return layer;
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

//Resize prop symbols accordingly
function updatePropSymbols(map, attribute) {
	map.eachLayer(function(layer) {
		//Since there are 0's in the data, they may be considered undefined,
		//so the if statement won't run, so add >= 0 to include 0 data!
		if (layer.feature && (layer.feature.properties[attribute] >= 0)) {
			//console.log(layer.feature);
			//access feature properties;
			var props = layer.feature.properties;
			//update each feature's radius based on new attribute values
			var radius = calcPropSymbolRadius(props[attribute]);
			layer.setRadius(radius);

			//add Weather Station name to popup content string
			var popupContent = "<p><b>Weather Station: </b>" + props.stationName + "</p>";
			var timeStamp = attribute;

			//build popup content string
			var panelContent = "<p><b>Weather Station: </b><span class = 'weatherStation'>" + props.stationName + "</span></p>";
			//console.log(props.stationName);
			
			//add formatted attribute to panel content string
			
			panelContent += "<p><b>Rainfall from  " + timeStamp + ": </b>" + props[attribute] + " inches</p>";
			//console.log(panelContent);

			//replace the layer popup
			layer.bindPopup(popupContent, {
				offset: new L.Point (0, -radius),
				closeButton: false
			});

			if (props.stationName == $(".weatherStation").html()){

				$("#panelText").html(panelContent);
			};

			//add event listeners to open popups
			layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup;
					
				},
				click: function(){
					$("#panelText").html(panelContent);
				}
			});
			return layer;
		};
	});
};


//Sequencing Controls
//Create slider widget
function createSequenceControls(map, attributes){
	//create range inpute element (slider)
	$('#panelSequence').append('<input class = "range-slider" type = "range">');

	//set slider attributes
	$('.range-slider').attr({
		max: 7,
		min: 0,
		value: 0,
		step: 1

	});

	//add skip buttons
	$('#panelSequence').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panelSequence').append('<button class="skip" id="forward">Skip</button>');
	$('#reverse').html('<img src = "img/reverse_icon.png">');
	$('#forward').html('<img src = "img/forward_icon.png">');

	//E. Listen for user input through affordances (click)
	$('.skip').click(function() {
		//get the old index value
		var index = $('.range-slider').val();

		//F. Forward step incriment index, reverse decrement
		if ($(this).attr('id') == 'forward') {
			index++;
			//G. Wrap end around
			index = index > 7 ? 0 : index;
		} else if ($(this).attr('id') == 'reverse'){
			index--;
			//G. Wrap end around
			index = index < 0 ? 7 : index;
		};
	
		//H. Update slider position based on index position
		$('.range-slider').val(index);

		//I. Reassign values based on index
		updatePropSymbols(map, attributes[index]);

	});

	//Listen for user input through affordances (slider)
	$('.range-slider').on('input', function() {
		//F. get new index value
		var index = $(this).val();
		//Reassign values based on inidex
		updatePropSymbols(map, attributes[index]);

	});	
};

//Create an array of time data to keep track of the order
function processData(data) {
	//empty array to hold attributes
	var attributes = []

	//properties of the first feature in the dataset
	var properties = data.features[0].properties;

	//push each attribute name into attributes array
	for (var attribute in properties) {
		//only take attributes with rainfall values
		//console.log(attribute);
		if (attribute.indexOf('to') > -1) {
			attributes.push(attribute);
		};
	};

	return attributes;
};


//Add data
//creating a function to load in data from MegaCities.geojson using jquery ajax method
function getData(map) {
	$.ajax("data/575Lab1Data.geojson", {
		dataType: "json",
		success: function (response) {
			//create an attributes array
			var attributes = processData(response);

			//call function that use the data
			createPropSymbols(response, map, attributes);
			createSequenceControls(map, attributes);
		}		
	});
};

//5th interaction operator
//Function to add the maximum rainfall overlay data
function getOverlayData(map) {
	$.ajax("data/overlayData.geojson", {
		dataType: "json",
		success: function (response) {

			//marker style options are set to a variable
			var geojsonMarkerOptions = {
				radius: 10,
				fillOpacity: 0,
				color: "#000",
				weight: 2,
				opacity: 0.4,
			};
			//geoJSON layer with leaflet is created to add data to the map

			var overlayLayer = L.geoJson(response, {
			

				//pointToLayer is used to change the marker features to circle markers, 
				//styled with geojsonMarkerOptions
				pointToLayer: function (feature, latlng) {

					
					return L.circleMarker (latlng, geojsonMarkerOptions);
				}
			});
			
			overlayLayer.eachLayer(function(layer){

			var props = layer.feature.properties.maxRainfall;
			//console.log(props);

			var radius = calcPropSymbolRadius(props);

			layer.setRadius(radius);
			});
		

			var overlayRings = {
			"Maximum Rainfall": overlayLayer
			};


			L.control.layers(null, overlayRings).addTo(map);
			
		}
	});
	//updateRings(map);
};


//module 6 notes:
//attribute and temporal legend (size and time period)
//read lesson 1, don't implement any of it!
//refactoring-reorganizing the code, making it more efficient-don't have to do it!
//include data sources on web page!

//when the DOM is ready, createMap is called 
$(document).ready(createMap);
