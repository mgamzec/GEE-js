var sentinelimg = ee.ImageCollection('COPERNICUS/S2_SR')
 .filter('CLOUDY_PIXEL_PERCENTAGE < 10')
 .filterDate('2022-06-01', '2022-10-01')
 .filterBounds(rect);
var image1= sentinelimg.filter(ee.Filter.calendarRange(6, 6, 'month'));
var NDVI = function(image1) {
return image1.addBands(image1.normalizedDifference(['B8', 'B4']));
};
var image = image1.map(NDVI);
print(image)
var grfkNDVI = ui.Chart.image.seriesByRegion(
 image, // seçilen görüntü 
 rect, // bölge
 ee.Reducer.mean(), // aritmetik ortalama
 'nd', // seçilen band
 10); // ölçek
var grfk2NDVI = grfkNDVI
 .setChartType('LineChart')
 .setSeriesNames(['NDVI'])
 .setOptions({
 interpolateNulls: true,
 lineWidth: 1,
 pointSize: 3,
 title: 'NDVI yıllık değerlendirme',
 hAxis: {title: 'Tarih'},
 vAxis: {title: 'NDVI'}
});
print(grfk2NDVI)
