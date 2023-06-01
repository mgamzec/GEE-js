//GORUNTU1
var goruntu1=ee.ImageCollection('COPERNICUS/S2_SR')
 .filterDate('2020-07-20', '2020-08-05')
 .filterBounds(alan)
 .filter('CLOUDY_PIXEL_PERCENTAGE<5')
var clip1=goruntu1.mean().clip(alan)
Map.addLayer(clip1.select(['B4','B3','B2']),"",'RGB2020')
Map.addLayer(clip1.select(['B12','B8','B4']),"",'SWIR2020')
//GORUNTU2
var goruntu2=ee.ImageCollection('COPERNICUS/S2_SR')
 .filterDate('2021-08-10', '2021-08-30')
 .filterBounds(alan)
 .filter('CLOUDY_PIXEL_PERCENTAGE<5')
var clip2=goruntu2.mean().clip(alan)
Map.addLayer(clip2.select(['B4','B3','B2']),"",'RGB2021')
Map.addLayer(clip2.select(['B12','B8','B4']),"",'SWIR2021')
//NBR1
var nirBand = 'B8';
var swirBand = 'B12';
var nbr2021 = clip2.normalizedDifference([nirBand, swirBand]);
Map.addLayer(nbr2021,"",'NBR2021')
//NBR2
var nirBand = 'B8';
var swirBand = 'B12';
var nbr2022 = clip1.normalizedDifference([nirBand, swirBand]);
Map.addLayer(nbr2022,"",'NBR2020')
var change = nbr2022.subtract(nbr2021)
var threshold = 0.3
var yananalan = change.gt(threshold)
Map.addLayer(yananalan, {min:0, max:1, palette: ['white', 'red']}, 'YananAlan', false)
