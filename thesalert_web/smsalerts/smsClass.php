<?php 
class smsClass
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
		    $this->db = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $username, $password, $options); 
		    $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
		    $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
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
	
	function sendSmsRegistered() {
		$sqlArray=$this->getLastRecord();
		require('twilio-twilio-php-348f5f2/Services/Twilio.php'); 
		$account_sid = 'YOUR TWILIO ACOUNT SID'; 
		$auth_token = 'YOUR TWILIO ACOUNT TOKEN'; 
		$sql = 'SELECT telNumber FROM sms_subscribers WHERE isRegistered=1 ';
		foreach ($this->db->query($sql) as $row) {
			$client = new Services_Twilio($account_sid, $auth_token); 
			$client->account->messages->create(array( 
			'To' => "+30".$row['telNumber'], 
			'From' => "twilio phone number", 
			'Body' => "Θεσσαλονίκη Alert - Ένα νέο συμβάν στην οδό ".$sqlArray[0]['address'] ,   
			));
		}
	}
	
	function getLastRecord(){
		$sql = 'SELECT * FROM alerts ORDER BY time DESC LIMIT 1 ';
		$sth = $this->db->prepare($sql);
		$sth->execute();
		$result = $sth->fetchAll();
		return $result;	
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
	
	function deleteUser($telnum)
	{
		$query = "DELETE FROM sms_subscribers WHERE telNumber='".$telnum."'";
		
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
		require('twilio-twilio-php-348f5f2/Services/Twilio.php'); 
		$account_sid = 'YOUR TWILIO ACOUNT SID'; 
		$auth_token = 'YOUR TWILIO ACOUNT TOKEN'; 
		$client = new Services_Twilio($account_sid, $auth_token); 
		$client->account->messages->create(array( 
			'To' => "+30".$num, 
			'From' =>  "twilio phone number", 
			'Body' => "Θεσσαλονίκη Alert - Ο κωδικός επιβεβαίωσης είναι: ".$code ,   
		));
	}
	function redirect_to($location) 
	{
	  if (headers_sent($filename, $line)) 
	  {
	    trigger_error("Headers already sent in {$filename} on line {$line}", E_USER_ERROR);
	  }
	  header("Location: {$location}");
	  exit;
	}


}//Class


?>