<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Admin panel  Thessaloniki Alert">
    <meta name="author" content="Θεόδωρος Δεληγιαννίδης">
    
    <title>Administrator - Θεσσαλονίκη Alert</title>

    <!-- Bootstrap core CSS -->
    <link href="../css/bootstrap.css" rel="stylesheet">
    <link href="../css/offcanvas.css" rel="stylesheet">
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Θεσσαλονίκη Alert - Admin Panel</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="index.php">Αρχική</a></li>
            <li><a href="emailAlerts.php">Ειδοποιήσεις</a></li>
            <li><a href="#contact">Χρήστες</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>

    <div class="container">
   

         <table class="table table-hover table-bordered table-condensed">
  <thead>
          <tr>
            <th>α/α</th>
            <th>Εικόνα</th>
            <th>Τύπος</th>
            <th>Ημερομηνία</th>
            <th>Τίτλος</th>
            <th>Περιγραφή</th>
            <th>Διεύθυνση</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          
 <?php 
$json_url ="http://localhost/markers_json.php?alt=99";
$json = file_get_contents($json_url);

$links = json_decode($json, TRUE);

foreach($links['places'] as $row)
{

echo  "<tr><td>".$row['id']."</td>";

echo  "<td><a id='various' href='http://localhost/assets/alertimages/".$row['image']."' /><img src='http://localhost/assets/alertimages/thumb_".$row['image']."' class='img-responsive img-rounded' width='45px' /></a></td>";
echo  "<td><img src='".$row['alert_icon']."'/></td>";
echo  "<td class='text-info'>".$row['time']."</td>";
echo  "<td>".$row['title']."</td>";
echo  "<td>".$row['description']."</td>";
echo  "<td>".$row['address']."</td>";
echo  "<td><a href='Delete.php?id=".$row['id']."'/><button type='button' class='btn btn-danger'>Διαγραφή</button></a></tr>";
}
?>  
         
        </tbody>
       </table>

    </div><!--/span-->    
    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="../fancybox/source/jquery.fancybox.min.css" type="text/css" media="screen" />
    <script type="text/javascript" src="../fancybox/source/jquery.fancybox.pack.js"></script>
    <script src="../js/fancy_admin.js"></script>

  </body>
</html>