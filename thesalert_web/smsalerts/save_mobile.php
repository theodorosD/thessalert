<?php
//header('Content-Encoding: UTF-8');
$telephone_number=$_POST['mobile_input'];
$agree=$_POST['agreecheck'];
if(!isset($agree))
{
//ex=3 agree with terms
redirect_to("index.php?ex=3");
}
if(strlen($telephone_number)<10 || strlen($telephone_number)==0)
{
//ex=2 wrong number format
redirect_to("index.php?ex=2");
}
include("db.php");
require('twilio-twilio-php-348f5f2/Services/Twilio.php'); 
DEFINE('DATABASE_USER', $username);
DEFINE('DATABASE_PASSWORD', $password);
DEFINE('DATABASE_HOST', $host);
DEFINE('DATABASE_NAME', $dbname);

class genPass
{
private $db;
	function __construct() {
	
		$this->db=new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);
	        $this->db->set_charset("utf8");
		$this->db->autocommit(FALSE);

	}
	function __destruct() {
		$this->db->close();
	}  

function doesNumberExists($num)
{
  $stmt=$this->db->query("SELECT * FROM sms_subscribers WHERE telNumber='".$num."'")or die($this->db->error);
   
 	if($stmt->num_rows <1)
    	{
  	return FALSE;
 	}else{
 	return TRUE;
 	}
}


function addNumberToDB($num,$code)
{
$query = "INSERT INTO sms_subscribers (telNumber,generatedID) VALUES('".$num."','".$code."')";

	if ($stmt = $this->db->prepare($query))
	{
	$stmt->execute();
	$stmt->close();
	}
}

function isItRegistered($num)
{
$query = "SELECT `telNumber` , `isRegistered`  FROM sms_subscribers WHERE telNumber='".$num."'";
	if ($stmt = $this->db->prepare($query))
	{
	    $stmt->execute();
	    $stmt->bind_result($telnum,$reg);
	     while ($stmt->fetch()) {
	      //printf ("%s",$reg);
	      return $reg;

	     	}
	    $stmt->close();
	}
	
}

function isCodeInDB($num)
{
$query = "SELECT `telNumber` , `generatedID`  FROM sms_subscribers WHERE telNumber='".$num."'";
	if ($stmt = $this->db->prepare($query))
	{
	    $stmt->execute();
	    $stmt->bind_result($telnum,$reg);
	     while ($stmt->fetch()) {
	      //printf ("%s",$reg);
	      return $reg;
	     	}
	    $stmt->close();
	}
}


public function generateStrongPassword($length = 5, $add_dashes = false, $available_sets = 'd')
{
	$sets = array();
	if(strpos($available_sets, 'l') !== false)
		$sets[] = 'abcdefghjkmnpqrstuvwxyz';
	if(strpos($available_sets, 'u') !== false)
		$sets[] = 'ABCDEFGHJKMNPQRSTUVWXYZ';
	if(strpos($available_sets, 'd') !== false)
		$sets[] = '23456789';
	if(strpos($available_sets, 's') !== false)
		$sets[] = '!@#$%&*?';
 
	$all = '';
	$password = '';
	foreach($sets as $set)
	{
		$password .= $set[array_rand(str_split($set))];
		$all .= $set;
	}
 
	$all = str_split($all);
	for($i = 0; $i < $length - count($sets); $i++)
		$password .= $all[array_rand($all)];
 
	$password = str_shuffle($password);
 
	if(!$add_dashes)
		return $password;
 
	$dash_len = floor(sqrt($length));
	$dash_str = '';
	while(strlen($password) > $dash_len)
	{
		$dash_str .= substr($password, 0, $dash_len) . '-';
		$password = substr($password, $dash_len);
	}
	$dash_str .= $password;
	return $this->$dash_str;
}

function sendSms($num,$code)
{
	$account_sid = 'YOUR TWILIO ACOUNT SID'; 
	$auth_token = 'YOUR TWILIO ACOUNT TOKEN';
	$client = new Services_Twilio($account_sid, $auth_token); 
	$client->account->messages->create(array( 
		'To' => "+30".$num, 
		'From' =>  "twilio phone number", 
		'Body' => "Θεσσαλονίκη Alert - Ο κωδικός επιβεβαίωσης είναι: ".$code ,   
	));
}

}//Class genPass end


$obj=new genPass;
if($obj->doesNumberExists($telephone_number) && !$obj->isItRegistered($telephone_number))
{

//echo "Number exists but not registered.";
$code=$obj->generateStrongPassword();
$obj->sendSms($telephone_number,$code);
redirect_to("input_code.php?tel=$telephone_number");

}elseif(!$obj->doesNumberExists($telephone_number)){

//echo "Number doesn't exists\r\n";
$code=$obj->generateStrongPassword();
$obj->addNumberToDB($telephone_number,$code);
$obj->sendSms($telephone_number,$code);
redirect_to("input_code.php?tel=$telephone_number");

}elseif($obj->doesNumberExists($telephone_number) && $obj->isItRegistered($telephone_number)){

//echo "Number exist and is registered";
//echo "Redirecting to index.php with alert";
//ex=1 number already registered
redirect_to("index.php?ex=1");

}

function redirect_to($location) {
  if (headers_sent($filename, $line)) {
    trigger_error("Headers already sent in {$filename} on line {$line}", E_USER_ERROR);
  }
  header("Location: {$location}");
  exit;
}
?>
