var image = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
 .filterDate('2022-06-01', '2022-09-30')
 .filter('CLOUD_COVER < 10')
 .filterBounds(ant_merkez)
print(image)
var scene = image.mean();
var rgb= scene.select('B4', 'B3', 'B2')
var hsv = scene.select('B4', 'B3', 'B2').rgbToHsv()
print(hsv)

var sharp = ee.Image.cat([
 hsv.select('hue'), hsv.select('saturation'), scene.select('B8')
]).hsvToRgb();
Map.addLayer(sharp.clip(ant_merkez),"",'PanSharpening')
Map.addLayer(rgb.clip(ant_merkez),"",'RGB')
