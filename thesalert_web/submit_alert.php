<?php
ini_set('session.cookie_lifetime', 60 * 60 * 24 * 7); 
//require_once 'google-api-php-client/src/Google_Client.php';
//require_once 'google-api-php-client/src/contrib/Google_Oauth2Service.php';
session_start();

$sadr=$_GET['adr'];
$slng=$_GET['lng'];
$slat=$_GET['lat'];
if(!empty($sadr)){
$_SESSION['Slat']=$slat;
$_SESSION['Slng']=$slng;
$_SESSION['Sadr']=$sadr;
}
?>

<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
    <meta name="description" content="Thessaloniki Alert">
    <meta name="author" content="Δεληγιαννίδης Θεόδωρος">
    <title>Thessaloniki Alert - Προσθήκη συμβάντος</title>
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
        <a class="navbar-brand" href="index.php"><span class="glyphicon glyphicon-bell"></span>Thessaloniki Alert</a>
    </nav>
    <form role="form"  id="myform" autocomplete="on" method="post" action="sendalert_pdo.php" enctype="multipart/form-data" style="margin:5px 5px 0px 5px">

        <div class="form-group">
            <label for="nameInput">Ονοματεπώνυμο<span style="color:red">*</span></label>
<?php
  /*if(isset($authUrl)) {
    print "<a class='login' href='$authUrl'>Σύνδεση με ένα λογαριασμό Google!</a>";
  } else {
   print "<a class='logout' href='?logout'>Αποσύνδεση</a>";
  }*/
?>
 <div class="input-group">
                <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
            <input type="name" class="form-control" id="nameInput" onkeypress="dokeypress(event,'submitFunction')" placeholder="Το ονοματεπώνυμο ή το ψευδώνυμο σας" name="myname" required="required">
        </div>
            <span class="help-block"><small>Το ονομά σας δεν εμφανίζεται πουθενά.</small></span>
</div>

        <div class="form-group">
            <label for="exampleInputEmail1">Email διεύθυνση<span style="color:red">*</span>
            </label>
            <div class="input-group">
                <span class="input-group-addon">@</span>
                <input type="email" class="form-control" onkeypress="dokeypress(event,'submitFunction')" id="exampleInputEmail1" placeholder="Το email σας" name="email" required="required">
            </div>
            <!--<span class="help-block"><small>Θα σας σταλθεί επιβεβαίωση για το συμβάν.</small></span>-->
        </div>

        <div class="form-group">
            <label for="location">Διεύθυνση συμβάντος</label>
<div class="input-group">
                <span class="input-group-addon"><span class="glyphicon glyphicon-road"></span></span>
            <input class="form-control" id="location" onkeypress="dokeypress(event,'submitFunction')" placeholder="Τοποθεσία" name="address">
        </div></div>

        <div class="form-group">
            <label>Κατηγορία συμβάντος<span style="color:red">*</span>
            </label>
<div class="input-group">
                <span class="input-group-addon"><span class="glyphicon glyphicon-list"></span></span>

            <select class="form-control" name="alert_cat" required="required">
                <option value="1">Κυκλοφοριακό πρόβλημα / Ατύχημα</option>
                <option value="2">Πολιτιστικά δρώμενα</option>
                <option value="3">Επικίνδυνα σημεία</option>
                <option value="4">Χρήσιμες πληροφορίες</option>
                <option value="5">Πορείες/Διαδηλώσεις</option>
            </select>
        </div>        </div>

        <div class="form-group">
            <label for="title">Τίτλος <span style="color:red">*</span>           </label>
<div class="input-group">
                <span class="input-group-addon"><span class="glyphicon glyphicon-tag"></span></span>
            <input class="form-control" id="title" onkeypress="dokeypress(event,'submitFunction')" placeholder="Τίτλος" name="title" required="required">
        </div></div>

        <div class="form-group">
            <label for="description">Περιγραφή</label>
            <textarea class="form-control" id="description" rows="3" name="description" required="required" autocorrect="on" placeholder="Περιγραφή του συμβάντος"></textarea>
        </div>


        <div class="form-group">
            <label for="exampleInputFile">Φωτογραφία <span class="glyphicon glyphicon-camera"></span>
            </label>
            <!-- <input type="file" id="file" name="img" accept="image/*"> -->
        </div>

<div id="area">
         <div>
                        <input name="photo" type="file" id="inputfileID"/>
                        <u style="cursor:pointer" id="u">Επιλογή φωτογραφίας συμβάντος</u>
                        <p><spana></spana></p>
                       
        </div> 
</div>
        
     <label class="checkbox" for="checkbox1">
  <input type="checkbox" value="agree" id="checkbox1" name="agreecheck" required="required" data-toggle="checkbox">
  Συμφωνώ με τους όρους χρήσης δήλωσης συμβάντος.
</label>
       
        <div class="form-group">
            <span class="help-block"><small><span style="color:red">*</span>Απαραίτητο πεδίο</small>
            </span>
        </div>
        <input type="hidden" name="latitude" value='<?php echo $_GET["lat"]; ?>' />
        <input type="hidden" name="longitude" value='<?php echo $_GET["lng"]; ?>' />
        <input type="hidden" id="imgresp" name="imgse" value="" />

        <button type="submit" class="btn btn-embossed btn-primary"><span class="glyphicon glyphicon-open"></span>Αποστολή</button>
       <button onclick="window.location.href='index.php'" class="btn btn-embossed btn-primary"><span class="glyphicon glyphicon-remove"></span>Άκυρο</button>
    </form>
    <br>
    <br>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

<script>
 $('#nameInput').attr('maxlength', 50);
 $('#exampleInputEmail1').attr('maxlength', 50);
 $('#title').attr('maxlength', 30);
 $('#description').attr('maxlength', 100);
 var elem1 = document.getElementById("exampleInputEmail1");
 elem1.value = '<?php echo $email;?>';
 var elem2 = document.getElementById("nameInput");
 elem2.value = '<?php echo $name;?>';
 var elem3 = document.getElementById("location");
 elem3.value = '<?php echo $_SESSION['Sadr'];?>';
 var elem4 = document.getElementById("latitude");
 elem4.value = '<?php echo $_SESSION['Slat'];?>';
 var elem5 = document.getElementById("longitude");
 elem5.value = '<?php echo $_SESSION['Slng'];?>';

 function dokeypress(e, functionName) {
 	if (e.which == 13) {
 		document.activeElement.blur();
 		eval(functionName + "();");
 	}
 }
</script>
     <script>

                        $().ready(function () {
 	$('#area u').click(function () {
 		$('input[name=photo]').trigger(
 			'click');
 	});
 	$('input[name=photo]').change(
 		function (e) {
 			var file = e.target.files[0];
 			// RESET
 			$('#area p span').css('width', 0 +
 				"%").html('');
 			$('#area img, #area canvas').remove();
 			$('#area i').html(JSON.stringify(e
 				.target.files[0]).replace(/,/g,
 				", <br/>"));
 			// CANVAS RESIZING
 			$.canvasResize(file, {
 				width: 640,
 				height: 0,
 				crop: false,
 				quality: 80,
 				//rotate: 90,
 				callback: function (data, width,
 					height) {
 					// IMAGE UPLOADING
 					// =================================================
 					// Create a new formdata
 					var fd = new FormData();
 					// Add file data
 					var f = $.canvasResize(
 						'dataURLtoBlob', data);
 					f.name = file.name;
 					fd.append($('#area input').attr(
 						'name'), f);
 					$.ajax({
 						url: 'uploader.php',
 						type: 'POST',
 						data: fd,
 						dataType: 'json',
 						contentType: false,
 						processData: false,
 						beforeSend: function (xhr) {
 							xhr.setRequestHeader(
 								"pragma", "no-cache");
 						},
 						xhr: function () {
 							var xhr = new window.XMLHttpRequest();
 							//Upload progress
 							xhr.upload.addEventListener(
 								"progress", function (e) {
 									if (e.lengthComputable) {
 										var loaded = Math.ceil((e
 												.loaded / e.total) *
 											100);
 										$('p span').css({
 											'width': loaded + "%"
 										}).html(loaded + "%");
 									}
 								}, false);
 							return xhr;
 						}
 					}).done(function (response) {
 						//console.log(response);
 						if (response.filename) {
 							// Complete
 							myone = response.filename;
 							myimagefile = myone.substring(
 								21);
 							document.getElementById(
 								"imgresp").value =
 								myimagefile;
 							console.log(document.getElementById(
 								"imgresp").value);
 							$('#area p span').html(
 								'Έτοιμο');
 							//$('#area b').html(response.filename);
 							$('<img>').attr({
 								'src': response.filename
 							})
 								.appendTo($('#area div'));
 							$("#inputfileID").prop(
 								'disabled', true);
 							$('#u').hide();
 							$('spana').hide();
 						}
 					});
 					// /IMAGE UPLOADING
 					// =================================================               
 				}
 			});
 		});
 });
                    </script>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/simple-sidebar.css" rel="stylesheet">
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery.exif.js"></script>
    <script src="js/jquery.canvasResize.js"></script>                
    <script src="js/canvasResize.js"></script>
</body>
</html>