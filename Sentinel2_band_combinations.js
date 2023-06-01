//Natural Color (B4, B3, B2)

var rgb=ee.ImageCollection('COPERNICUS/S2_SR')
 .filterDate('2022-06-01', '2022-10-26')
 .filter('CLOUDY_PIXEL_PERCENTAGE < 10')
 .select(['B4', 'B3', 'B2'])
 .filterBounds(ant_merkez)
print(rgb)
var rgbclip=rgb.mean().clip(ant_merkez)
Map.addLayer(rgbclip,"",'RGB')

//Color Infrared (B8, B4, B3)
var infrared=ee.ImageCollection('COPERNICUS/S2_SR')
 .filterDate('2022-06-01', '2022-10-26')
 .filter('CLOUDY_PIXEL_PERCENTAGE < 10')
 .select(['B8', 'B4', 'B3'])
 .filterBounds(ant_merkez)
var infraredclip=infrared.mean().clip(ant_merkez)
Map.addLayer(infraredclip,"",'Infrared')
//Agriculture (B11, B8, B2)
var agriculture=ee.ImageCollection('COPERNICUS/S2_SR')
 .filterDate('2022-06-01', '2022-10-26')
 .filter('CLOUDY_PIXEL_PERCENTAGE < 10')
 .select(['B11', 'B8', 'B2'])
 .filterBounds(ant_merkez)
var agricultureclip=agriculture.mean().clip(ant_merkez)
Map.addLayer(agricultureclip,"",'Agriculture')
Export.image.toDrive({
   image:rgbclip,
 description:'Sentinel2_Agriculture',
 scale:10,
 region:ant_merkez,
})
