<?php
error_reporting(0);
$cache_max_age = 60*60*12;
header( "Cache-Control: public, must-revalidate, max-age=0, s-maxage=$cache_max_age" ); 
if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) ob_start("ob_gzhandler"); else ob_start();

if(isset($_GET["alt"])){
$altc=$_GET["alt"];
}else{$altc=99;}
?>
<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <meta name="description" content="Η θεσσαλονίκη Live! Οι πολίτες συμβάλουν στην άμεση ενημέρωση συβάντων στην πόλη της Θεσσαλονίκηε. Διαθέσιμο για iPhone και Android συσκευές.">
    <meta name="author" content="Δεληγιαννίδης Θεόδωρος">
    <title>Θεσσαλονίκη Alert</title>
    <meta name="viewport" content="user-scalable=0, width=device-width, initial-scale=0.8, maximum-scale=1.0, minimum-scale=1.0" /> 
    <meta name="apple-mobile-web-app-capable" content="yes">
 <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
 <script src="http://maps.google.com/maps/api/js?key=AIzaSyDrosE1KrQgcKV8hbO6HglZcc4uVwTXUqg&sensor=false&libraries=places&language=el"></script>

</head>

<body>
 <div id="map"></div> 
    <div id="over_map">
       <div class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <a class="navbar-brand" href="index.php">
      <span class="glyphicon glyphicon-bell">
      </span>
      Θεσσαλονίκη Alert
    </a>
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="icon-bar">
        </span>
        <span class="icon-bar">
        </span>
        <span class="icon-bar">
        </span>
      </button>
    </div>
    
    <div class="navbar-collapse collapse" id="searchbar">
      <ul class="nav navbar-nav navbar-right">
        <li>
          
          <div class="form-group" style="margin-top:6px;padding-left:3px;">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
              Μενού 
              <span class="caret">
              </span>
            </button>
            
            <button style="margin-left:2px;border-radius: 3px;" type="button" data-toggle="collapse" class="btn btn-primary" id="btnInit">
              Η τοποθεσία μου 
              <span class="glyphicon glyphicon-screenshot">
              </span>
            </button>
            
            <ul class="dropdown-menu pull-right" role="menu" >
              <li>
                <a href="index.php?alt=99">
                  Αρχική
                </a>
              </li>
              <li class="divider">
              </li>
              <li>
                <a id="cat1" href="#">
                  <img  style="margin-right:2px" src="assets/icons/roadtransport/cars.png"/>
                  Κυκλοφοριακό/Ατύχημα
                </a>
              </li>
              <li>
                <a id="cat2" href="#">
                  <img  style="margin-right:2px" src="assets/icons/culture/musica.png"/>
                  Πολιτιστικά δρώμενα
                </a>
              </li>
              <li>
                <a id="cat3" href="#">
                  <img  style="margin-right:2px" src="assets/icons/naturaldisaster/danger.png"/>
                  Επικίνδυνα σημεία
                </a>
              </li>
              <li>
                <a id="cat4" href="#">
                  <img  style="margin-right:2px" src="assets/icons/media/info.png"/>
                  Χρήσιμες πληροφορίες
                </a>
              </li>
              <li>
                <a id="cat5" href="#">
                  <img  style="margin-right:2px" src="assets/icons/crime/march.png"/>
                  Πορείες/Διαδηλώσεις
                </a>
              </li>
              <li class="divider">
              </li>
              <li role="presentation" class="dropdown-header">
                Εργαλεία
              </li>
		<li>
                <a href="http://eepurl.com/Nk57P">
                  Ειδοποιήσεις μέσω email
                </a>
              </li>
              <li>
                <a href="smsalerts/index.php">
                  Ειδοποιήσεις μέσω SMS
                </a>
              </li>
               <li class="divider"></li>
              <li>
                <a href="help.php">
                  Βοήθεια
                </a>
              </li>
               <li>
                <a href="policy.html">
                  Όροι χρήσης
                </a>
              </li>
            </ul>
          </div>
          
        </li>
      </ul>
      
      <div class="form-group" style="display:inline;">
        <div class="input-group" style="margin-top:6px;margin-bottom:2px;">
          <span class="input-group-addon">
            <span class="glyphicon glyphicon-search">
            </span>
          </span>
          <input type="text" class="form-control " id="searchTextField" autopost="false" autocomplete="off" placeholder="Κάντε κλίκ στο χάρτη ή πληκτρολογήστε μια διεύθυνση εδώ.">
        </div>
      </div>
      
      <!--  
<div class="form-group" style="display:inline;">
-->
                
              </div>
              <!--/.nav-collapse -->
   </div>
</div>

</div>
<!-- over_map div -->
    
<div id="alerta">
  <div id="alert" class="alert alert-success alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
      Κλείσιμο
    </button>
    <strong>
      Καλώς ήρθατε!
    </strong>
    Περιηγηθείτε στο χάρτη και κάντε κλικ για να προσθέσετε ένα συμβάν. Θέλετε βοήθεια; Πατήστε 
    <a href="help.php">
      εδώ.
    </a>
  </div>
</div>


<script>
if (!localStorage.getItem("visited")) {
   document.getElementById("alerta").style.visibility="visible";
    localStorage.setItem("visited", "true");
}else{
   document.getElementById("alerta").style.visibility="hidden";
}
var complex = <?php echo json_encode($altc); ?>;

$('#cat1').click(function(){setStorageCat(1); return false;});
$('#cat2').click(function(){setStorageCat(2); return false;});
$('#cat3').click(function(){setStorageCat(3); return false;});
$('#cat4').click(function(){setStorageCat(4); return false;});
$('#cat5').click(function(){setStorageCat(5); return false;});
function setStorageCat(cat)
{
    localStorage.setItem("category", cat);
    window.location.href = 'index.php?alt='+cat;
}
function myClick(plat,plng){
var centerCoord = new google.maps.LatLng(plat,plng);
map.setCenter(centerCoord);
};
</script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/main_unzip.js"></script>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/simple-sidebar.css" rel="stylesheet">
    <link href="fancybox/source/jquery.fancybox.min.css" rel="stylesheet" media="screen" />
    <script src="fancybox/source/jquery.fancybox.pack.js"></script>
    <!--<script src="js/infobox.js"></script>-->
</body>
</html>