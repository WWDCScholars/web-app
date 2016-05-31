
<!DOCTYPE HTML>
<?php
	require('keys.php');
	require 'vendor/autoload.php';
	use Parse\ParseClient;
	use Parse\ParseQuery;
	use Parse\ParseObject;
	use Parse\ParseFile;
	ParseClient::initialize($app_id, $rest_key, $master_key);
?>
<html>
	<head>
		<title>WWDC Scholars</title>
		<meta property="og:title" content="Scholars List" />
		<meta property="og:image" content="http://wwdcscholars.com/WWDC-Scholars-Web-2015/apple-touch-icon.png" />
		<meta property="og:description" content="We're scholars from all around the world and we combined our knowledge, our innovation and our love for software to build this app to inspire kids, students and future iOS developers to build apps that can inspire the world." />
		<?php
			include('commonHeader.php');
		?>
	</head>
	<body>
		<a href="index.php" style="text-decoration:none;">
			<div id="head">
				<h1>&#63743; WWDC</h1><h2>Scholars</h2>
			</div>
		</a>
		<div class="container">
			<?php
				//DETERMINE CORRECT PEOPLE TO LOAD, GIVEN PAGE
				parse_str($_SERVER['QUERY_STRING']);
				if(!isset($page)){
					$page = 0;
				}
				$limit = 24;

				//LOAD DATA FROM PARSE
				$query = new ParseQuery("scholars");
				$query->ascending("lastName");
				$query->limit($limit);
				$query->skip($page * $limit); 
				try{
					$results = $query->exists('objectId');
				}catch(ParseException $ex){
				}
				$scholars = $results->find();

				//DISPLAY DATA ON SCREEN
				for($i = 0; $i < count($scholars); $i++){
					$oliver= $scholars[$i];
					$imgUrl = $oliver->get("profilePic");
					echo '<a href="detail.php?page=' . $oliver->getObjectId() . '">';
					echo '<div class="square" style="background-image:url(\'';
					echo $imgUrl->getURL();
					echo '\');';
					echo '">';
					echo '<h1>' . $oliver->get("firstName") . ' ' . $oliver->get('lastName') . '</h1>';
					echo '</div></a>';
				}
			?>
			<?php
				//IF NOT PAGE 0, SHOW PREVIOUS PAGE BUTTON
				if($page > 0){
			?>
			<a href="index.php?page=<?php echo $page - 1; ?>">
				<div class="pageLink left">
					&laquo; Previous
				</div>
			</a>
			<?php
				}
				else{
					echo '<style>.pageLink{ width:100%; }</style>';
				}
				if(count($scholars) == $limit){
			?>
			<a href="index.php?page=<?php echo $page + 1; ?>">
				<div class="pageLink right">
					Next &raquo;
				</div>
			</a>
			<?php
				}
				else{
					echo '<style>.pageLink{ width:100%; }</style>';
				}
			?>
		</div>
		<div class="container">
			<h1>Are you a <b>&#63743; WWDC</b>15 scholarship winner?</h1>
			<p>Congratulations! We'll see you on June 7<sup>th</sup> for the Scholarship Orientation Session! For now, you can join us all on <a href="https://www.facebook.com/groups/477629149059210" target="_blank"> Facebook</a> and <a href="http://riffic.io" target="_blank">submit your details here</a>!</p>
		</div>
		<div class="container">
			<h1>Press Opportunities</h1>
			<p>
				For more information about the <b>&#63743; WWDC</b>15 Scholars website and app, please e-mail <a href="mailto:veryhappymichie@gmail.com">Michie Ang</a>.
				<br><br>
				Local press may find the map of Scholars in our iOS App useful for finding a local scholar!
			</p>
		</div>
		<div id="footer">
			<p>
				<b>&#63743; WWDC</b> 15 Scholars is not affiliated with Apple Inc. in any way. It is made by a group of the Apple Scholarship Winners.
			</p>
		</div>
	</body>
</html>
