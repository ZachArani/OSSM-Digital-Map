<?php
/*
OSSM STUDENT MAP v1.0
FIRST IMPLEMENTED BY ZACH ARANI, CLASS OF 2017 (contact:cloud12817@gmail.com, myrrhman@ou.edu, github:ZachArani)
LAST COMMIT BY ZACH ARANI, CLASS OF 2017

ORIGINAL AUTHOR'S COMMENT:
The original query function. Send it a county name, and it'll return all the students from that county in an array.
*/
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
}
$query = '"'. $_POST['data'] .'"';
$sql =<<<EOF
	SELECT * FROM STUDENTS WHERE COUNTY=$query
EOF;
$ret = $db->query($sql);
$post_data =array();
while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
	array_push($post_data,
			array(
					'Class' => $row['CLASS'],
					'Name' => $row['NAME'],
					'School' => $row['SCHOOL'],
					'City' => $row['CITY']
			));
}
print json_encode($post_data);
?>