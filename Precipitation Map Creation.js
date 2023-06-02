var dataset = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD')
 .filter(ee.Filter.date('2022-01-01', '2022-12-31'))
 .select('precipitation')
var precipitationVis = {
 min: 0.0,
 max: 112.0,
 palette: ['001137', '0aab1e', 'e7eb05', 'ff4a2d', 'e90000'],
};
Map.centerObject(alan)
var clip=dataset.mean().clip(alan)
Map.addLayer(clip, precipitationVis, 'Yagis');
