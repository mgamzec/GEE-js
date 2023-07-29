// Image Visualization

// Get a feature collection with Laos boundary
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var Egypt = countries.filter(ee.Filter.eq('country_na', 'Egypt'));

// Load an image collection.
var image = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA').filterDate('2016-01-01','2016-12-31')
.filterBounds(Egypt)
.median();

// Define the visualization parameters.
var vizFalse = {
  bands: ['B5', 'B4', 'B3'],
  min: 0,
  max: 0.5,
  gamma: [0.95, 1.1, 1]
};

var vizTrue = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 0.5,
  gamma: [0.95, 1.1, 1]
};

// Center the map and display the image.
Map.addLayer(image, vizTrue, 'True Color Composite');
Map.addLayer(image, vizFalse, 'False Color Composite');
//Create a blank image to accept the polygon outlines.
var image1 = ee.Image(0).mask(0);
//Outline using the specified color and width.
var image2 = image1.paint(Egypt, 'ff00ff', 2); 
Map.addLayer(image2, {'palette': '000000', 'opacity': 0.5}, "Egypt");
Map.centerObject(Egypt, 6);
