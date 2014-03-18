<?php
class myClass
{
private $db;

	function __construct() {
		include("db.php");
		DEFINE('DATABASE_USER', $username);
		DEFINE('DATABASE_PASSWORD', $password);
		DEFINE('DATABASE_HOST', $host);
		DEFINE('DATABASE_NAME', $dbname);

		try
		{ 
		    $this->datab = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $username, $password, $options); 
		    $this->datab->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
		    $this->datab->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		} 
		catch(PDOException $e)
		{ 
		    $this->isConnected = false;
		    throw new Exception($e->getMessage());
		}
	}
	
	function __destruct() {
		//$this->db->close();
		$this->db=null;
	}
	
	function sendEmail()
	{
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://localhost/emailalerts/runphp.php");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,FALSE);
		curl_exec($ch);
		curl_close($ch);
	}//sendEmail

	function sendNotification($address,$title,$message)
	{
		$APPLICATION_ID = "PARSE NOTIFICATIONS ID";
		$REST_API_KEY = "PARSE NOTIFICATIONS API KEY";
		
		$url = 'https://api.parse.com/1/push';
		
		$data = array(
		    'where'=>'{}',
		    'expiry' => 1451606400,
		    'data' => array(
		        'alert' => $address.'-Ένα νέο συμβάν με τίτλο: '.$title,
		    ),
		);
		
		$_data = json_encode($data);
		$headers = array(
		    'X-Parse-Application-Id: ' . $APPLICATION_ID,
		    'X-Parse-REST-API-Key: ' . $REST_API_KEY,
		    'Content-Type: application/json',
		    'Content-Length: ' . strlen($_data),
		);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $_data);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		$result = curl_exec($curl);
		curl_close($curl);
	
	}//sendNotification
	
	function sendSms()
	{
	
	
	}//sendSms
	
	function redirect_to($location) 
	{
		  if (headers_sent($filename, $line)) 
		  {
		    trigger_error("Headers already sent in {$filename} on line {$line}", E_USER_ERROR);
		  }
		  ob_start();
		  header("Location: {$location}");
		  ob_end_flush();
		  exit;
	}//redirect to


}//myClass



?>