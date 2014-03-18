<?php
if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) ob_start("ob_gzhandler"); else ob_start();
include("db.php");
header('Content-Type: text/javascript; charset=UTF-8');

$altype=$_GET["alt"];
$pdo=new PDO("mysql:dbname=$dbname;host=$host",$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

if($altype<=5 && $altype>=1)
{
$statement=$pdo->prepare("SELECT address, description, alerts.id, lng, lat, time, image, title,alert_types.alert_name as alertname, alert_types.id AS alerttypeid,alert_types.alert_icon
FROM alerts  LEFT JOIN alert_types ON alerts.alerttype = alert_types.id WHERE alerttype =".$altype." AND showhide=TRUE AND time BETWEEN (SYSDATE() - INTERVAL 1 DAY) AND SYSDATE()");
}else{
$statement=$pdo->prepare("SELECT address, description, alerts.id, lng, lat, time, image, title,alert_types.alert_name as alertname, alert_types.id AS alerttypeid,alert_types.alert_icon
FROM alerts LEFT JOIN alert_types ON alerts.alerttype = alert_types.id WHERE showhide=TRUE AND time BETWEEN (SYSDATE() - INTERVAL 1 DAY) AND SYSDATE() ORDER BY time DESC LIMIT 1");
}
$pdo->exec("SET NAMES 'utf8'");
$statement->execute();
$results=$statement->fetchAll(PDO::FETCH_ASSOC);
$json=json_encode(array('places' => $results));
echo $json;
?>
