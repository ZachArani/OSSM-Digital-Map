<?php
/*
OSSM STUDENT MAP v1.0
FIRST IMPLEMENTED BY ZACH ARANI, CLASS OF 2017 (contact:cloud12817@gmail.com, myrrhman@ou.edu, github:ZachArani)
LAST COMMIT BY ZACH ARANI, CLASS OF 2017

ORIGINAL AUTHOR'S COMMENT:
See:QueryHeader
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
    $type = '"'. $_POST['searchType'] .'"';
	  $header = '"'. $_POST['headType'] . '"';
    $queryLike = '"%'. $_POST['data'] . '%"';



      $sql =<<<EOF
	      SELECT * FROM STUDENTS WHERE $type LIKE $queryLike ORDER BY $header DESC
EOF;
      $ret = $db->query($sql);
      $post_data =array();
      while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
	      array_push($post_data,
			      array(
					      'Class' => $row['CLASS'],
					      'Name' => $row['NAME'],
					      'School' => $row['SCHOOL'],
					      'City' => $row['CITY'],
					      'County' => $row['COUNTY']
			      ));
      }

    print json_encode($post_data);
?>