<?php
header('Content-Encoding: UTF-8');

$telephone_number=$_POST['mobile_input'];
$user_code=$_POST['code_input'];


include("/home/thessalo/db.php");
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


function isCodeCorrect($num,$user_input)
{

$query = "SELECT `telNumber` , `generatedID`  FROM sms_subscribers WHERE telNumber='".$num."'";

	if ($stmt = $this->db->prepare($query))
	{
	
	    $stmt->execute();
	    $stmt->bind_result($telnum,$reg);
	     while ($stmt->fetch()) {
	     //printf ("%s",$reg);
	     if($reg==$user_input){return TRUE;}
	      	}
	    $stmt->close();
	}
	
}

function registerUser($telnum)
{
$query = "UPDATE sms_subscribers SET isRegistered='1' WHERE telNumber='".$telnum."'";

	if ($stmt = $this->db->prepare($query))
	{
	$stmt->execute();
	$stmt->close();
	}
}

}
function redirect_to($location) {
  if (headers_sent($filename, $line)) {
    trigger_error("Headers already sent in {$filename} on line {$line}", E_USER_ERROR);
  }
  header("Location: {$location}");
  exit;
}
$obj=new genPass;
if($obj->isCodeCorrect($telephone_number,$user_code)){
$obj->registerUser($telephone_number);
redirect_to("index.php?ex=4");
}else{
redirect_to("input_code.php?tel=$telephone_number");
}

?>

