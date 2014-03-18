<?php 
error_reporting(-1);
require_once 'db.class.php';

$json_url ="http://localhost/emailalerts/list.php";
$json = file_get_contents($json_url);
$links = json_decode($json, TRUE);
foreach($links['emails'] as $row)
{

if(checkEmailStatus($row['email']))
{
echo "Exists\n";
}else{
insertEmail($row['email'],"0");
echo "ok\n";
}

}

function insertEmail($emailToInsert,$emailOption)
{
        $dbHandle = new DBConnection();
	$sql = "INSERT INTO email_alerts (email,send_options) VALUES (:email,:options)";
	$q = $dbHandle->prepare($sql);
	$q->execute(array(':email'=>$emailToInsert,':options'=>$emailOption));
}

function checkEmailStatus($emailToCheck)
{
	$dbHandle = new DBConnection();
	$sql = "SELECT * FROM email_alerts WHERE email='".$emailToCheck."' LIMIT 1";
    	$stmt = $dbHandle->prepare($sql);
    	$stmt->execute();
    	$stmt->setFetchMode(PDO::FETCH_ASSOC);
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	if($row)
	{
		return  true;
	}else{
		return false;
	}

}

?>
