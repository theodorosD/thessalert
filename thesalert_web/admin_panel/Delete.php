<?php
require('db.php');
$id=$_GET['id'];

echo '<head>';
echo '<meta http-equiv="refresh" content="0; URL=./index.php">';
echo '</head>';

mysql_connect($host,$username,$password)or die("Local Host Error".mysql_error());
mysql_select_db($dbname)or die("cannot select DB");

$sql="UPDATE alerts SET showhide=0 WHERE id=".$id;
$result=mysql_query($sql);

if($result){
echo "Deleted Successfully";
echo "<BR>";
echo "<a href='index.php'>Back to main page</a>";
}
else{
var_dump($result);
}
mysql_close();
?>