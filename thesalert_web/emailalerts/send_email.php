<?php
require_once "Mail.php"; 

$json_url ="http://localhost/emailalerts/markers_json.php?alt=99";
$json = file_get_contents($json_url);
$links = json_decode($json, TRUE);

$json_url2 ="http://localhost/emailalerts/list.php";
$json2 = file_get_contents($json_url2);
$links2 = json_decode($json2, TRUE);

foreach($links['places'] as $row)
{

foreach($links2['emails'] as $row2)
{

$from = '<thessaloniki.alerts@gmail.com>';
$to = "<".$row2['email'].">";
$subject = "Θεσσαλονίκη Alert - ".$row['title'];
$body = "<html><head></head><body>Μόλις καταχωρήθηκε ένα νέο συμβάν στην οδό <b>".$row['address']."</b> στις<time> ".$row['time']."</time><br><b>Τίτλος:</b> " .$row['title']."<br><b>Περιγραφή:</b> " .$row['description']."<br><b>Κατηγορία:</b> " .$row['alertname']."</body></html>";

/*$headers  = "From: " .$from. "\r\n";
$headers .= "CC: ".$from."\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html;charset='utf-8'\r\n";
$headers .= "Content-Transfer-Encoding: base64";
*/
$headers = array(
    'From' => $from,
    'CC'=>$from,
    'To' => $to,
    'Subject' => $subject,
    'Content-Type'=>'text/html;charset=utf-8'
);

$smtp = Mail::factory('smtp', array(
        'host' => 'ssl://smtp.gmail.com',
        'port' => '465',
        'auth' => true,
        'username' => 'your_email@gmail.com',
        'password' => 'your_password'
    ));

$mail = $smtp->send($to, $headers, $body);

if (PEAR::isError($mail)) {
    echo('<p>' . $mail->getMessage() . '</p> ');
} else {
    echo('Message successfully sent!\r\n ');
}

}//LOOP
}//LOOP
?>