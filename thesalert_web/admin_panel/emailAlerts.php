<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Admin panel for Thessaloniki Alert">
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
          <a class="navbar-brand" href="#">Thessaloniki Alert - Admin Panel</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li><a href="index.php">Αρχική</a></li>
            <li class="active"><a href="emailAlerts.php">Ειδοποιήσεις</a></li>
            <li><a href="#contact">Χρήστες</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>

    <div class="container">
   

         <table class="table table-hover table-bordered table-condensed">
  <thead>
          <tr>
            <th>Email</th>
            </tr>
        </thead>
        <tbody>
          
 <?php 
$json_url ="http://localhost/emailalerts/list.php";
$json = file_get_contents($json_url);

$links = json_decode($json, TRUE);

foreach($links['emails'] as $row)
{

echo  "<tr><td>".$row['email']."</td>";
}
?>  
         
        </tbody>
       </table>

    </div><!--/span-->    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="../fancybox/source/jquery.fancybox.min.css" type="text/css" media="screen" />
    <script type="text/javascript" src="../fancybox/source/jquery.fancybox.pack.js"></script>
    <script src="../js/fancy_admin.js"></script>

  </body>
</html>