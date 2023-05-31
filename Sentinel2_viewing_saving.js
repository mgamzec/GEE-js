var image=ee.ImageCollection('COPERNICUS/S2_SR')
 .filterDate('2022-06-01','2022-09-30')
 .filter('CLOUDY_PIXEL_PERCENTAGE<10')
 .select('B4','B3','B2')
 .filterBounds(ant_merkez)
print(image)

Map.addLayer(ant_merkez,"",'ant_merkez')
Map.addLayer(image.mean())

var clip=image.mean().clip(ant_merkez)
Map.addLayer(clip,"",'ClipRGB')

Export.image.toDrive({
 image:clip,
 description:'ant_merkez_sentinel2clip',
 scale:10,
 region:ant_merkez,
 maxPixels: 1E10
 
})
