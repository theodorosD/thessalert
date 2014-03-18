<?php
include("db.php");

$classObj  = new myClass();
if (isset($_POST["email"]) && !empty($_POST["email"]) && isset($_POST["title"]) && !empty($_POST["title"]) && isset($_POST["alert_cat"]) && !empty($_POST["alert_cat"])  ) {

	if(empty($_POST["imgse"]))
	{
		$img="noalert.png";
	}else{
		$img=$_POST["imgse"];
	}
		
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
		$dbh = $pdo=new PDO("mysql:dbname=$dbname;host=$host",$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
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
	
		$classObj->sendEmail();
		$classObj-> sendNotification($address,$title,$message);
		$classObj->redirect_to("index.php");
	
}
else{
		$classObj->redirect_to("index.php");
}

function __autoload($class_name) {
    include $class_name . '.php';
}

?>