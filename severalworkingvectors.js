// Get map center.

var center = Map.getCenter();
print('Center point', center);
-95.2,34.8;

// Get zoom level of map.  

var zoom = Map.getZoom();
print('Zoom level', zoom);

// Set map center and zoom.  

Map.setCenter(-73.1812983597342, 44.013157468373876, 19);

Map.setOptions('HYBRID');

// Construct new point geometry object.  

var point = ee.Geometry.Point([0,0]);

// Inspect the result.

print('Point object', point);

// Set a property of point.

var point_feature = ee.Feature(point, {name: 'my first point'});

// Print the two different objects to compare.  

print('Point as geometry', point, 'Point as feature', point_feature);

// Construct two points.

var point = ee.Geometry.Point([0,0]);
var point2 = ee.Geometry.Point([-90,60]);

// Construct line from two points.

var line = ee.Geometry.LineString([point, point2]);

// Inspect results.

print('Great circle arc', line);

// Display result as a layer on the map.

Map.addLayer(line, {color: 'red'}, 'Great circle line');

//  Calculate the length of a line object.

var line_length = line
  .length()                   
  ;

// Inspect result.  

print('route distance', line_length);

//  Calculate the length of a line object.

var line_length_km = line
  .length()
  .divide(1000)                   
  ;

// Inspect result.  

print('route distance kilometers', line_length_km);


// ----------------------------------------------------------------------------
// Vector objects.  
// ----------------------------------------------------------------------------

// Here are three starter coordinates stored as a dictionary.

var coords = {
  pt1: [-73.168687, 44.013513],
  pt2: [-73.156242, 44.006167],
  pt3: [-73.173494, 44.008142]
  }
;

// Here are three geometries constructed from these coordinates.  

var geometry = ee.Geometry.Point(coords.pt1);
var geometry2 = ee.Geometry.Point(coords.pt2);
var geometry3 = ee.Geometry.Point(coords.pt3);

// Here are three features.

var point01 = ee.Feature(geometry,{name: 'S', number: 1});
var point02 = ee.Feature(geometry2,{name: 'O', number: 2});
var point03 = ee.Feature(geometry3,{name: 'S', number: 3});

// Here is a feature collection that contains three features.  

var point_collection = ee.FeatureCollection([point01, point02, point03]);

// Inspect the collection.  

print('Point collection', point_collection);  



// ----------------------------------------------------------------------------
// To buffer a feature.
// ----------------------------------------------------------------------------

var buffer = point01.buffer(1000);

print('buffer a feature', buffer);

Map.addLayer(buffer, {color:'blue'}, 'Buffer a feature',0);



// ----------------------------------------------------------------------------
// To compute area of a feature.
// ----------------------------------------------------------------------------

var area_buffer = buffer.area();

print('area of buffer', area_buffer);

var buffer_with_area = buffer.set({area: area_buffer});

print('buffer with area', buffer_with_area);


// ----------------------------------------------------------------------------
// Union two features.
// ----------------------------------------------------------------------------

var buffer = point01.buffer(1000);
var buffer2 = point02.buffer(1000);

var union_features = buffer.union(buffer2);

print('Union of two features', union_features);

Map.addLayer(union_features, {color: 'gray'}, 'Union from two features',0);



// ----------------------------------------------------------------------------
// Inspect the first feature in the collection.
// ----------------------------------------------------------------------------

print('First feature', point_collection.first());
Map.addLayer(intersection_features, {color: 'gray'}, 'Intersection of two features',0);

// ----------------------------------------------------------------------------
// Inspect all the unique values for one property of features in the collection.
// ----------------------------------------------------------------------------

// 1. Get list.  

var value_list = point_collection
  .aggregate_array('name')
  .distinct()
  .sort()
;

// 2. Print list.  

print('list of values', value_list);

// ----------------------------------------------------------------------------
// Filter collection by a nominal attribute.
// ----------------------------------------------------------------------------

var points_filtered_by_name = point_collection
  .filter(ee.Filter.eq('name', 'S'))
  ;

print ('selected by nominal attribute', points_filtered_by_name);

Map.addLayer(points_filtered_by_name, {color: 'yellow'}, 'Selected by name',0);

// ----------------------------------------------------------------------------
// Filter collection by a numeric attribute.
// ----------------------------------------------------------------------------

var points_filtered_by_number = point_collection
  .filter(ee.Filter.gt('number', 1))
  ;

print ('selected by numeric attribute', points_filtered_by_number);

Map.addLayer(points_filtered_by_number, {color: 'cyan'}, 'Selected by number',0);

// ----------------------------------------------------------------------------
// To buffer every feature in a collection:  
// ----------------------------------------------------------------------------

// 1. Define a function.

var buffer_points = function(point){
  var buffered_point = point.buffer(1000);
  return buffered_point;
  }
;

// 2. Map function over collection.  

var buffers = points_filtered_by_number.map(buffer_points);

print('buffer all featuers in collection filtered by number', buffers);

Map.addLayer(buffers, {color:'green'}, 'Buffer all features in collection filtered by number',0);

// ----------------------------------------------------------------------------
// To compute area of every feature in a collection:  
// ----------------------------------------------------------------------------

// 1. Define a function.

var compute_area = function(feature) {
  var area_feature = feature.area();
  var features_with_area = feature.set({area: area_feature});
  return features_with_area;
};

// 2. Map function over collection.

var buffers_with_area = buffers.map(compute_area);

print('buffers with area', buffers_with_area);

// ----------------------------------------------------------------------------
// Filter for features that intersect another feature's geometry.
// ----------------------------------------------------------------------------

var points_in_buffer = point_collection
  .filterBounds(buffer.geometry())          
;

Map.addLayer(points_in_buffer, {color:'red'}, 'Points in buffer',0);

// ----------------------------------------------------------------------------
// Filter for features that intersect another feature collection.
// ----------------------------------------------------------------------------

var points_in_buffers = point_collection
  .filterBounds(buffers)
;

Map.addLayer(points_in_buffers, {color:'magenta'}, 'Points in buffers from name filter',0);

// ----------------------------------------------------------------------------
// Union features in a feature collection.    
// ----------------------------------------------------------------------------

var union_feature_collection = buffers.union();

print('Union from feature collection', union_feature_collection);

Map.addLayer(union_feature_collection, {color: 'black'}, 'Union from feature collection',0);

// ----------------------------------------------------------------------------
// Intersection between a feature and collection.      
// ----------------------------------------------------------------------------

// 1. Define a function.

var intersect_features = function(feature) {
  var intersection = feature.intersection(buffer);
  return intersection;
  }
;

// 2. Map function across collection.

var intersection_feature_collection = buffers.map(intersect_features);

print('Intersection from feature collection', intersection_feature_collection);

Map.addLayer(intersection_feature_collection, {color: 'black'}, 'Intersection from feature collection',0);

// --------------------------------------------------------------------------------
// Display attributes of feature collection as a table.
// --------------------------------------------------------------------------------

// In this example, large_owners contains the parts of parcels that overlap corridor with acres as an attribute.

var results = ui.Chart.feature.byFeature(large_owners, 'OWNER1');
results.setChartType('Table');
results.setOptions(
  {
    allowHtml: true,                // Formatted values of cells with html tags will be rendered as HTML.
    pageSize: 50,                   // The number of rows to show in each page.
    frozenColumns: 1,               // The number of columns from the left to 'freeze' when scrolling horizontally. Note that this works in the Console, but not when you open the table in a new browser panel.    
    sort: 'enable',                 // Users can click on a header to sort table by that column.  
    sortAscending: false,           // True = sort ascending; False = sort descending.
    sortColumn: 1                   // Index of column to sort. 0 is first column, 1 is second.  
  }
)
;
results.style().set({stretch: 'both'});

// Print table.

print('Land owners to contact', results);


// --------------------------------------------------------------------------------
// Display attributes of feature collection as a table.
// --------------------------------------------------------------------------------

// In this example, large_owners contains the parts of parcels that overlap corridor with acres as an attribute.

var results = ui.Chart.feature.byFeature(large_owners, 'OWNER1');
results.setChartType('Table');
results.setOptions(
  {
    allowHtml: true,                // Formatted values of cells with html tags will be rendered as HTML.
    pageSize: 50,                   // The number of rows to show in each page.
    frozenColumns: 1,               // The number of columns from the left to 'freeze' when scrolling horizontally. Note that this works in the Console, but not when you open the table in a new browser panel.    
    sort: 'enable',                 // Users can click on a header to sort table by that column.  
    sortAscending: false,           // True = sort ascending; False = sort descending.
    sortColumn: 1                   // Index of column to sort. 0 is first column, 1 is second.  
  }
)
;
results.style().set({stretch: 'both'});

// Print table.

print('Land owners to contact', results);


// Create a function to convert feature collection to image.

var makeImage = function(fc, property) {
  return ee.Image()                                 //  Create empty image
    .byte()                                         //  Store as byte
    .paint(fc, property);                           //  Paint values at locations from property of feature collection (fc).
  }
;

// Use function to convert a feature collection to an image.  

var output =                   // Name output variable
  makeImage(                   // Call function from above
    fc_name,                   // feature collection  
    'property_name'            // property of fc to use as pixel values
  )
;


// Print information about a feature collection.  

print(
  'fc check',           // Label to print to console.
  fc.first(),           // First record in collection.
  fc.size()             // Number of records in collection.
  )
;

print(
   'fc numerical property check',          // Label to print to console.
   fc.aggregate_min('property name'),      // Print min value of specified property.
   fc.aggregate_max('property name')       // Print max value of specified property.
  )
;


// Add feature collection to map as a layer for a quick check.

Map.addLayer(fc, {}, 'fc quick check', 0);


// Construct image from address.

var output_image = ee.Image('address');


// Inspect an image.

print('label', data_object);        // Where data_object is the name of the variable that holds the image. 


// Inspect an image.

print('label', data_object);        // Where data_object is the name of the variable that holds the image. 
