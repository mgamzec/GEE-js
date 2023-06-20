// Year list to map
var yearList = [1990, 1995, 2000, 2005, 2010, 2015, 2020];

// Function to filter
function filterCol(col, roi, date){
  return col.filterDate(date[0], date[1]).filterBounds(roi);
}

// Composite function
function landsat457(roi, date){
  var col = filterCol(l4, roi, date).merge(filterCol(l5, roi, date)).merge(filterCol(l7, roi, date));
  var image = col.map(cloudMaskTm).median().clip(roi);
  return image;
}

function landsat89(roi, date){
  var col = filterCol(l8, roi, date).merge(filterCol(l9, roi, date));
  var image = col.map(cloudMaskOli).median().clip(roi);
  return image;
}

// Cloud mask
function cloudMaskTm(image){
  var qa = image.select('QA_PIXEL');
  var dilated = 1 << 1;
  var cloud = 1 << 3;
  var shadow = 1 << 4;
  var mask = qa.bitwiseAnd(dilated).eq(0)
    .and(qa.bitwiseAnd(cloud).eq(0))
    .and(qa.bitwiseAnd(shadow).eq(0));
  
  return image.select(['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'], ['B2', 'B3', 'B4', 'B5', 'B6', 'B7']).updateMask(mask);
}

function cloudMaskOli(image){
  var qa = image.select('QA_PIXEL');
  var dilated = 1 << 1;
  var cirrus = 1 << 2;
  var cloud = 1 << 3;
  var shadow = 1 << 4;
  var mask = qa.bitwiseAnd(dilated).eq(0)
    .and(qa.bitwiseAnd(cirrus).eq(0))
    .and(qa.bitwiseAnd(cloud).eq(0))
    .and(qa.bitwiseAnd(shadow).eq(0));
  
  return image.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['B2', 'B3', 'B4', 'B5', 'B6', 'B7']).updateMask(mask);
}

// Generate image per year
var builtCol = ee.ImageCollection(yearList.map(function(year){
  var start = ee.Date.fromYMD(year, 1, 1);
  var end = ee.Date.fromYMD(year, 12, 31);
  var date = [start, end];
  
  // Conditional on landsat collection to use
  var landsat;
  if (year < 2014) {
    landsat = landsat457;
  } else {
    landsat = landsat89;
  }
  
  // Create an image composite
  var image = landsat(roi, date).multiply(0.0000275).add(-0.2);
  
  // Show the image
  Map.addLayer(image, { min: [0.1, 0.1, 0], max: [0.4, 0.35, 0.2], bands: ['B5', 'B6', 'B2'] }, 'Landsat_' + year, false);
  
  // Band map
  var bandMap = { 
    NIR: image.select('B5'), 
    SWIR: image.select('B6'), 
    RED: image.select('B4'), 
    GREEN: image.select('B3'), 
    BLUE: image.select('B2') 
  };
  
  // Normalized Difference Built-up Index
  var ndbi = image.expression('(SWIR - NIR) / (SWIR + NIR)', bandMap).rename('NDBI');
  
  // Show the NDBI
  Map.addLayer(ndbi, { min: -1, max: 1, palette: ['blue', 'white', 'red'] }, 'NDBI_' + year, false);
  
  // Modified Normalized Difference Water Index
  var mndwi = image.expression('(GREEN - SWIR) / (GREEN + SWIR)', bandMap).rename('MNDWI');
  
  // Show the MNDWI
  Map.addLayer(mndwi, { min: -1, max: 1, palette: ['red', 'white', 'blue'] }, 'MNDWI_' + year, false);
  
  // Built up
  var built = ee.Image(0).where(ndbi.gt(-0.1).and(mndwi.lte(0)), year)
    .selfMask()
    .clip(roi);
  Map.addLayer(built, { palette: 'red' }, 'Built-up_' + year, false);
  
  // Image area for calculation
  var area = built.multiply(ee.Image.pixelArea().multiply(0.0001)).rename('area');
  
  return built.toUint16().rename('built').addBands(area).set('year', year, 'system:time_start', start);
}));

// Create dictionary for each year expansion for visualization
var dict = {
  'built_class_values': yearList,
  'built_class_palette': ['800080', '0000FF', '00FFFF', '008000', 'FFFF00', 'FFA500', 'FF0000']
};

// Create expansion image
var urbanExpansion = builtCol.select('built').min().set(dict);
Map.addLayer(urbanExpansion, {}, 'Urban_expansion');

// Create legend for expansion year
var legend = ui.Panel([ui.Label('Urban expansion')], ui.Panel.Layout.flow('vertical'), { position: 'bottom-left' });
yearList.map(function(year, index){
  legend.add(ui.Panel([
    ui.Label('', { width: '20px', height: '20px', backgroundColor: dict.built_class_palette[index], border: '0.5px solid black' }),
    ui.Label(year)
  ], ui.Panel.Layout.flow('horizontal')));
});
Map.add(legend);

// Create table to show the urban area change
var areaChart = ui.Chart.image.series(builtCol.select('area'), roi, ee.Reducer.sum(), 30, 'year')
  .setChartType('AreaChart')
  .setOptions({
    title: 'Urban area (Ha)',
    hAxis: { title: 'Year' },
    vAxis: { title: 'Area (Ha)' }
  });
print(areaChart);
