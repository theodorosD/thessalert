<?php
if(isset($_GET["ex"])){
$ex=$_GET["ex"];
}else{$ex="0";}
switch($ex)
{
	case 1:
	$error_string="Ο αριθμός σας είναι ήδη εγγεγραμμένος στην υπηρεσία";
	break;
	
	case 2:
	$error_string="Παρακαλούμε εισάγετε έναν έγκυρο αριθμό κινητού τηλεφώνου.";
	break;
	
	case 3:
	$error_string="Θα πρέπει να συμφώνήσετε με τους όρους χρήσης για να χρησιμοποιήσετε την υπηρεσία."	;
	break;

	case 4:
	$error_string="Η εγγραφή ολοκληρώθηκε με επιτυχία."	;
	break;
	
	case 5:
	$error_string="Ο αριθμός σας διαγράφηκε από την υπηρεσία με επιτυχία."	;
	break;
	
	case 6:
	$error_string="Παρουσιάστηκε ένα λάθος(101)."	;
	break;

}
?>

<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
    <meta name="description" content="Thessaloniki Alert">
    <meta name="author" content="Δεληγιαννίδης Θεόδωρος">
    <title>Θεσσαλονίκη Alert - Ειδοποιήσεις με sms</title>
<style>
#area div p spana{display:block;width:0;margin-top:5px;background:blue;text-align:center;background-color:#fecf23;background-image:linear-gradient(top,#fecf23,#fd9215);-moz-box-shadow:0 5px 5px rgba(255,255,255,.7) inset, 0 -5px 5px rgba(255,255,255,.7) inset;-webkit-box-shadow:0 5px 5px rgba(255,255,255,.7) inset, 0 -5px 5px rgba(255,255,255,.7) inset;box-shadow:0 5px 5px rgba(255,255,255,.7) inset, 0 -5px 5px rgba(255,255,255,.7) inset;padding:2px 0;}
#area img{max-width:100%;height:auto;border-radius:5px;margin:10px 0;}
#area input{visibility:hidden;height:0;}
#area u{display:block;text-align:center;background:#ddd;border-radius:6px;padding:15px;}
#area div p,#area b,#area img{display:block;}.media{margin-left:10px;<?php if($ex>0){echo "margin-top:45px;";}?>}
</style>
</head>
<body>
    <nav class="navbar navbar-default navbar-static-top" role="navigation">
        <a class="navbar-brand" href="http://91.196.124.42/index.php"><span class="glyphicon glyphicon-bell"></span>Θεσσαλονίκη Alert</a>
    </nav>
   <div class="media" >
  <a class="pull-left">
    <img class="media-object" src="http://static.iconsplace.com/icons/preview/black/sms-64.png">
  </a>
  <div class="media-body">
    <h4 class="media-heading">Ειδοποιήσεις μέσω SMS</h4>
    Ενημερωθείτε άμεσα και γρήγορα για κάθε σημαντικό συμβάν,όπως κυκλοφοριακό πρόβλημα ή ατύχημα. Η εγγραφή είναι δωρεάν και δεν χρεώνεστε για κάθε SMS που θα λαμβάνετε. <a href="unregister.php"/>Πατήστε εδώ</a> εάν οποιαδήποτε στιγμή θελήσετε να διαγράψετε τον αριθμό σας από την υπηρεσία.
  </div>
</div>
    <form role="form"  id="myform" autocomplete="on" method="post" action="save_mobile.php" enctype="multipart/form-data" style="margin:45px 5px 0px 5px">

        <div class="form-group">
            <label for="nameInput">Ο αριθμός του κινητού σας<span style="color:red">*</span></label>
 <div class="input-group  input-group-lg">
                <span class="input-group-addon"><span class="glyphicon glyphicon-earphone"></span></span>
            <input type="text" class="form-control bfh-phone" data-format="69dddddddd" id="mobile_input" onkeypress="dokeypress(event,'submitFunction')" placeholder="Ο αριθμός σας" name="mobile_input" required="required">
        </div>
            <span class="help-block"><small>Θα σας σταλθεί ένα sms επιβεβαίωσης με ένα 5ψηφιο κωδικό. To sms δεν χρεώνεται.</small></span>
</div>
        
     <label class="checkbox" for="checkbox1">
  <input type="checkbox" value="agree" id="checkbox1" name="agreecheck" required="required" data-toggle="checkbox">
  Συμφωνώ με τους όρους χρήσης και δηλώνω ότι ο παραπάνω αριθμός μου ανήκει.
</label>
       
        <div class="form-group">
            <span class="help-block"><small><span style="color:red">*</span>Απαραίτητο πεδίο</small>
            </span>
        </div>
        
        <button type="submit" class="btn btn-embossed btn-primary"><span class="glyphicon glyphicon-open"></span>Αποστολή</button>
 </form>
 
<div id="alerta">
  <div id="alert" class="alert <?php if($ex=="4"||$ex=="5"){echo "alert-success";}else{echo "alert-danger";}?> alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
      Κλείσιμο
    </button>
   <?php echo $error_string; ?>
    </a>
  </div>
</div>
       
    <br>
    <br>
    <script>
    var ex=<?php echo $ex; ?>;
    console.log(ex);
if (ex>0) {
   document.getElementById("alerta").style.visibility="visible";
}else{
   document.getElementById("alerta").style.visibility="hidden";
}
</script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="../js/bootstrap-formhelpers-phone.js"></script>
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/simple-sidebar.css" rel="stylesheet">
    <script src="../js/bootstrap.min.js"></script>
</body>
</html>