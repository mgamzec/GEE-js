var image = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_NO2')
 .filterBounds(alan)
 .select('NO2_column_number_density')
 .filterDate('2022-12-01', '2022-12-31')
var image2=image.mean().clip(alan)
var vis = {
 min: 0,
 max: 0.0002,
 palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
}
Map.addLayer(image2,vis,'N02')
Export.image.toDrive({
 image:image2,
 description:'NO2_Antalya122022',
 scale:1113,
 region:alan,
})
