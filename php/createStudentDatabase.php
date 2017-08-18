<?php
   class MyDB extends SQLite3
   {
      function __construct()
      {
         $this->open('students.db');
      }
   }
   $db = new MyDB();
   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      echo "Opened database successfully\n";
   }
   $sql =<<<EOF
      CREATE TABLE STUDENTS
      (CLASS INT NOT NULL,
      NAME   TEXT NOT NULL,
      SCHOOL TEXT NOT NULL,
   	  CITY TEXT NOT NULL,
   	  COUNTY TEXT NOT NULL);
EOF;
   $ret = $db->exec($sql);
   if(!$ret){
   	echo $db->lastErrorMsg();
   } else {
   	echo "Table created successfully\n";
   }
$row = 1;
if (($handle = fopen("updated roster.csv", "r")) !== FALSE) {
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		$num = count($data);
		echo "$num fields in line $row:\n";
		$row++;
		for ($c=0; $c < $num; $c+=6) {
			$d = $c+1;
			$e = $c+2;
			$f = $c+3;
			$g = $c+4;
			$h = $c+5;
			$class = '"'.$data[$c].'"';
			$name = '"'.$data[$d].' '.$data[$e].'"';
			$school = '"'.$data[$f].'"';
			$city = '"'.$data[$g].'"';
			$county = '"'.$data[$h].'"';
			echo $class . "\n";
			echo $name . "\n";
			echo $school . "\n";
			echo $city . "\n";
			echo $county . "\n";
			$sql =<<<EOF
			INSERT INTO STUDENTS (CLASS, NAME, SCHOOL,CITY,COUNTY)
      		VALUES ($class, $name, $school, $city, $county);
EOF;
		
		}
		$ret = $db->exec($sql);
		if(!$ret){
			echo $db->lastErrorMsg();
		} else {
			echo "Records created successfully\n";
		}
	}
	fclose($handle);
}


$db->close();
?>