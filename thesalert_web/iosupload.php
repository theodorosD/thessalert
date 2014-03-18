<?php
/* if(empty($_FILE["imgse"]["name"])
{
$img="noalert.jpg";
}else{
*/
include("db.php");

$img=$_POST["imagefilename"];
$uploaddir = './assets/alertimages/';
$uploadFullImage = $uploaddir .$img;
$uploadThumbImage= $uploaddir ."thumb_".$img;
if(!file_exists($uploadFullImage)){
if (move_uploaded_file($_FILES['imgse']['tmp_name'], $uploadFullImage)) {
if (file_exists($uploadFullImage)) {
if(copy($uploadFullImage, $uploadThumbImage)){

exec("convert $uploadThumbImage -resize 320x150^ -gravity Center -crop 320x150+0+0 +repage $uploadThumbImage");
exec("convert $uploadfile -resize 640x640\> $uploadfile");
echo "OK";

}//move_uploaded_file
}//file_exists
}//copy
}//!file_exists
				$myname=$_POST["myname"];
				$email=$_POST["email"];
				$address= $_POST["address"];
				$alertcat=$_POST["alert_cat"];		
				$title=$_POST["title"];
                                $description=$_POST["description"];
                                $lat=$_POST["latitude"];
				$lng=$_POST["longitude"];
				$ip = $_SERVER["REMOTE_ADDR"];
				
try {
    $dbh=new PDO("mysql:dbname=$dbname;host=$host",$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,true);

    $stmt = $dbh->prepare("INSERT INTO alerts(time,title, description, lat,lng,alerttype,image,address,name,email,ip) VALUES (NOW(),:title,:description,:lat,:lng,:alertcat,:img,:address,:myname,:email,:ip)");
    
$stmt->bindParam(':title', $title);
$stmt->bindParam(':description', $description);
$stmt->bindParam(':lat', $lat);
$stmt->bindParam(':lng', $lng);
$stmt->bindParam(':alertcat', $alertcat);
$stmt->bindParam(':img', $img);
$stmt->bindParam(':address', $address);
$stmt->bindParam(':myname', $myname);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':ip', $ip);
$stmt->execute();
$dbh = null;
    
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}
$payload = file_get_contents('http://localhost/emailalerts/runphp.php');
echo "OK";
?>