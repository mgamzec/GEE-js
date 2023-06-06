/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var antalya = ee.FeatureCollection("projects/ee-mgc-thesis/assets/ant_merkez_sinir");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//LANDSAT image
var goruntu = ee.ImageCollection('LANDSAT/LC08/C02/T1')
 .filterDate('2022-06-01', '2022-09-10')
 .filter('CLOUD_COVER < 10')
 .filterBounds(antalya)
var goruntu_kesilmis=goruntu.mean().clip(antalya)
print(goruntu)

//1.TOA calculate
//TOA = 0,0003342 * "Bant 10" + 0,1
var toa = goruntu_kesilmis.expression(
 '0.0003342*BAND10+0.1', {
 'BAND10': goruntu_kesilmis.select('B10'),
}).rename('TOA')
print(toa)

//2.BT calculate
//BT = (1321.0789 / Ln ((774.8853 /TOA) + 1)) – 273.15
var bt=toa.expression(
  '(1321.0789/log((774.8853/TOA)+1))-273.15',{
 'TOA':toa.select('TOA')
 }).rename('BT');
print(bt)

//3.NDVI
var nirBand = 'B5';
var redBand = 'B4';
var ndvi = goruntu_kesilmis.normalizedDifference([nirBand, redBand]).rename('NDVI');
Map.addLayer(ndvi, {min: -1, max: 1}, 'NDVI');
Map.addLayer(ndvi,"",'NDVI')
 var min = ee.Number(ndvi.reduceRegion({
 reducer: ee.Reducer.min(),
 geometry: antalya,
 scale: 30,
 maxPixels: 1e10
 }).values().get(0));
 var max = ee.Number(ndvi.reduceRegion({
 reducer: ee.Reducer.max(),
 geometry: antalya,
 scale: 30,
 maxPixels: 1e10
 }).values().get(0));
print(min)
print(max)

//4.PV calculate
//Pv = ^2 ((NDVI – NDVI min ) / (NDVI maks – NDVI min ))
var pv = (ndvi.subtract(min).divide(max.subtract(min))).pow(ee.Number(2))
Map.addLayer(pv,"",'PV')

//5.Emistivite calculate
//ε = 0,004 * P v + 0,986
var a=ee.Number(0.004)
var b=ee.Number(0.986)
var em=pv.multiply(a).add(b).rename('EMM')

//6.LST Hesaplama
//LST = (BT / (1 + (0,00115 * BT / 1,4388) * Ln(ε)))
var termal=goruntu_kesilmis.select('B10').multiply(0.1)
var LST=bt.expression(
 '(BT/(1+(0.00115*BT/1.4388)*log(e)))',{
 'BT':bt.select('BT'),
 'e':em.select('EMM'),
 }).rename('LST')
 
//Palent
var vis = {
 palette: [
 '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
 '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
 '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
 'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
 'ff0000', 'de0101', 'c21301', 'a71001', '911003'
 ],
}

Map.addLayer(LST,vis,"LST")
Map.addLayer(goruntu_kesilmis,"",'RGB')

//Export 
Export.image.toDrive({
 image:LST,
 description:'LST_2022_ant_merkez',
 scale:30,
 region:antalya,
})
