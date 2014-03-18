<?php
$apikey = 'MAILCHIMP API KEY';
$list_id = 'MAILCHIMP LIST ID';
$chunk_size = 4096; //in bytes
$url = 'http://us3.api.mailchimp.com/export/1.0/list?apikey='.$apikey.'&id='.$list_id.'&output=json';

/** a more robust client can be built using fsockopen **/
$handle = @fopen($url,'r');
if (!$handle) {
  echo "failed to access url\n";
} else {
  $i = 0;
  $header = array();
  while (!feof($handle)) {
    $buffer = fgets($handle, $chunk_size);
   if (trim($buffer)!=''){
      $obj = json_decode($buffer);
      if ($i==0){
        //store the header row
        $header = $obj;
      } else {
        //echo, write to a file, queue a job, etc.
      //echo $obj[0]."\n";
       $result[] = array('email' => $obj[0], 'option' => $obj[1]);  //push new obj to the array

       }
      $i++;
    }
  }

  fclose($handle);
echo json_encode(array('emails' => $result)); // convert to json format
}
?>
