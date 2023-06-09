var chirps= ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD')
var yil=chirps.filterDate('2022-01-01','2022-12-31')
var grafik1=ui.Chart.image.series(
 yil,alan,ee.Reducer.mean(),1000, 'system:time_start')

 .setOptions({
 title:'Aylık Yağış',
 hAxis:{title:'Zaman'},
 vAix:{title:'Yağış(mm)'}

 })
print(grafik1)
