<?php
$telNum=$_GET['tel'];
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
#area div p,#area b,#area img{display:block;}
</style>
</head>
<body>
    <nav class="navbar navbar-default navbar-static-top" role="navigation">
        <a class="navbar-brand" href="index.php"><span class="glyphicon glyphicon-bell"></span>Θεσσαλονίκη Alert</a>
    </nav>
    <form role="form"  id="myform" autocomplete="on" method="post" action="save_code.php" enctype="multipart/form-data" style="margin:5px 5px 0px 5px">

        <div class="form-group">
            <label for="nameInput">O 5ψήφιος κωδικός που σας έχει σταλθεί στον αριθμο <?php echo $telNum;?><span style="color:red">*</span></label>
 		<div class="input-group  input-group-lg">
                <span class="input-group-addon"><span class="glyphicon glyphicon-tag"></span></span>
            <input type="text" class="form-control bfh-phone" data-format="ddddd" id="mobile_input" onkeypress="dokeypress(event,'submitFunction')" placeholder="Κωδικός" name="code_input" required="required">
       		 </div>
	</div>
     <label class="checkbox" for="checkbox1">
  <input type="checkbox" value="agree" id="checkbox1" name="agreecheck" required="required" data-toggle="checkbox">
  Συμφωνώ με τους όρους χρήσης και δηλώνω ότι ο παραπάνω αριθμός μου ανήκει.
</label>
       
        <div class="form-group">
            <span class="help-block"><small><span style="color:red">*</span>Απαραίτητο πεδίο</small>
            </span>
        </div>
 <input type="hidden" name="mobile_input" value=<?php echo $telNum;?> >        
        <button type="submit" class="btn btn-embossed btn-primary"><span class="glyphicon glyphicon-open"></span>Επιβεβαίωση</button>
       <button onclick="window.location.href='../index.php'" class="btn btn-embossed btn-primary"><span class="glyphicon glyphicon-remove"></span>Άκυρο</button>
    </form>
    <br>
    <br>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="../js/bootstrap-formhelpers-phone.js"></script>
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/simple-sidebar.css" rel="stylesheet">
    <script src="../js/bootstrap.min.js"></script>
</body>
</html>