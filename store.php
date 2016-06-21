<?php
// the $_POST[] array will contain the passed in filename and data
// the directory "data" is writable by the server (chmod 777)

// write the file to disk
$subjectID = $_POST['subjectID'];
$folder = $_POST['folder'];
$csvData = $_POST['csvStrings'];
$jsonData = $_POST['dataAsJSON'];
$openshift_data_dir = $_ENV["OPENSHIFT_DATA_DIR"];
$timestr = date('Y-m-d_H:i:s');

//at first, write a backup copy of the json file into backup folder
if(!file_exists($openshift_data_dir.'json/')){ mkdir($openshift_data_dir.'json/',0777,true);}
for ($i = 0; $i < sizeof($jsonData); $i++) {
      file_put_contents($openshift_data_dir.'json/'.$timestr.'_'.$subjectID.'_incmem.txt', $jsonData);
};


// then put csvStrings in experiment folder.
if(!file_exists($openshift_data_dir.'csv/')){ mkdir($openshift_data_dir.'csv/',0777,true);}
for ($i = 0; $i < sizeof($csvData); $i++) {
      file_put_contents($openshift_data_dir.'csv/'.$timestr.'_'.$subjectID.'_incmem.csv', $csvData);
}
?>
