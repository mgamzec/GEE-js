var image = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_SO2')
.filterBounds(alan)
 .select('SO2_column_number_density')
 .filterDate('2022-12-01', '2022-12-31')
var image2=image.mean().clip(alan)
var vis = {
min: 0.0,
 max: 0.0005,
 palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
}
Map.addLayer(image2,vis,'SO2')
Export.image.toDrive({
 image:image2,
 description:'SO2_Antalya122022',
 scale:1113,
 region:alan,
})
