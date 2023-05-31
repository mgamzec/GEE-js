/*
This part will cover:

3.1. Where to get different datasets for GEE
3.2. How to import and visualize vector datasets
3.3. How to import and visualize raster datasets
3.4. How to import your own vector or raster dataset in GEE

code link: 
https://code.earthengine.google.com/534a2fd5728fe113788085f2cacdc445
*/

//3.1. Where to get different datasets for GEE
//https://developers.google.com/earth-engine/datasets
//https://samapriya.github.io/awesome-gee-community-datasets/

//3.2. How to import and visualize vector datasets
var dataset = ee.FeatureCollection("FAO/GAUL/2015/level0");

// html website: https://htmlcolorcodes.com/
var styleParams = {
  fillColor: '0863D0',
  color: '111111',
  width: 2.0,
};
dataset = dataset.style(styleParams);
Map.addLayer(dataset, {}, 'Country Boundaries', false);

//3.3. How to import and visualize raster datasets

var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
                  .filterDate('2017-01-01', '2017-12-31');
                  
var colorized = dataset.select('NDVI');
var colorizedVis = {
  min: 0.0,
  max: 1.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};
Map.setCenter(6.746, 46.529, 6);
Map.addLayer(colorized, imageVisParam, 'Colorized', false);


//3.4. How to import your own vector or raster dataset in GEE
Map.centerObject(AOI, 5)
Map.addLayer(AOI, {}, 'XYZ Imported File')
