<?php
/*
OSSM STUDENT MAP v1.0
FIRST IMPLEMENTED BY ZACH ARANI, CLASS OF 2017 (contact:cloud12817@gmail.com, myrrhman@ou.edu, github:ZachArani)
LAST COMMIT BY ZACH ARANI, CLASS OF 2017

ORIGINAL AUTHOR'S COMMENT:
Simply returns the Amount of Students. If no county is selected, it'll return all students.
If a county is selected, it returns students from that county only.
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
$county = '"'. $_POST['data'] .'"';
if($county == '""'){
	$sql =<<<EOF
	SELECT COUNT(*) as count FROM STUDENTS
EOF;
}
else{
$sql =<<<EOF
	SELECT COUNT(*) as count FROM STUDENTS WHERE COUNTY=$county
EOF;
}
$ret = $db->query($sql);
$post_data =array();
while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
	array_push($post_data,
			array(
					'Count' => $row['count'],
			));
}
print json_encode($post_data);
?>