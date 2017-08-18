
<?php
/*
OSSM STUDENT MAP v1.0
FIRST IMPLEMENTED BY ZACH ARANI, CLASS OF 2017 (contact:cloud12817@gmail.com, myrrhman@ou.edu, github:ZachArani)
LAST COMMIT BY ZACH ARANI, CLASS OF 2017

ORIGINAL AUTHOR'S COMMENT:
This used to be used to organize A-Z and Z-A but has been replaced with two seperate files due to bugs that I was too lazy to track down. QueryHeaderUpper and QueryHeaderDowner do the same thing.
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
	      SELECT * FROM STUDENTS WHERE $type LIKE $queryLike ORDER BY $header
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