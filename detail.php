<!DOCTYPE HTML>
<?php
	require 'keys.php';
	require 'vendor/autoload.php';
	use Parse\ParseClient;
	use Parse\ParseQuery;
	use Parse\ParseObject;
	use Parse\ParseFile;
	ParseClient::initialize($app_id, $rest_key, $master_key);
?>
<html>
	<head>
		<?php
			parse_str($_SERVER['QUERY_STRING']);
			$query = new ParseQuery("scholars");
			try{
				$query->equalTo("objectId", $page);
				$result = $query->find();
			}catch(ParseException $ex){
			}
			$scholar = $result[0];
		?>
		<title>WWDC Scholar - <?php echo $scholar->get('firstName') . " " . $scholar->get('lastName'); ?></title>
		<meta property="og:title" content="<?php echo $scholar->get('firstName') . " " . $scholar->get('lastName'); ?>"/>
		<meta property="og:image" content="<?php echo $scholar->get('profilePic')->getURL(); ?>">
		<meta property="og:description" content="<?php echo $scholar->get('shortBio'); ?>"/>
		<?php include('commonHeader.php'); ?>
	</head>
	<body>
		<a href="index.php" style="text-decoration:none;">
			<div id="head">
				<h1>&#63743; WWDC</h1><h2>Scholars</h2>
			</div>
		</a>
		<div class="container">
			<div class="third" id="profilePicture" style="min-height:330px;background-image:url('<?php echo $scholar->get('profilePic')->getURL();?>');">
			</div>

			<div class="third" id="infoStuff" style="position:relative;">
				<img class="bgIMG" src="http://maps.googleapis.com/maps/api/staticmap?center=<?php echo $scholar->get('location');?>&zoom=12&scale=false&size=670x330&maptype=roadmap&format=png&visual_refresh=true" style="position:absolute; z-index: -1; height:100%; width:100%; left:0; -webkit-filter:brightness(70%); filter: brightness(70%);"/>
				<h1><?php echo $scholar->get('firstName') . " " . $scholar->get('lastName') . ", " . $scholar->get('age');?></h1>
				<p style="margin-top: -15px;">
					<?php
						if($scholar->get('numberOfTimesWWDCScholar') == '1'){
							echo 'First time at WWDC!<br><br>';
				  		}
				  		else if($scholar->get('numberOfTimesWWDCScholar') != null){
				  			echo 'Has  attended WWDC ' . $scholar->get('numberOfTimesWWDCScholar') . ' times<br><br>';
				 		}
					?>
				</p>
				<div class="social" style="margin-top: -20px;">
					<?php
						if($scholar->get('email') != null){
							echo '<a href="mailto:' . $scholar->get('email') . '"target="_blank"><img src="images/gmail.png" style="border-radius: 0;"/></a> ';
						}
						if($scholar->get('website') != null){
							echo '<a href="' . $scholar->get('website') .  '"target="_blank"><img src="images/picasa.png" style="border-radius: 0;"/></a> ';
						}
						if($scholar->get('twitter') != null){
							echo '<a href="' . $scholar->get('twitter') . '"target="_blank"><img src="images/twitter.png" style="border-radius:0;"/></a> ';
						}
						if($scholar->get('linkedin') != null){
							echo '<a href="' . $scholar->get('linkedin') . '" target="_blank"><img src="images/linkedin.png" style="border-radius:0;"/></a> ';
						}
						if($scholar->get('facebook') != null){
							echo '<a href="' . $scholar->get('facebook') . '" target="_blank"><img src="images/facebook.png" style="border-radius:0;"/></a>';
						}
					?>
				</div>
				<p class="lead"><?php echo $scholar->get('shortBio');?></p>
				<?php 
					if ($scholar->get('itunes') != null) {
						echo '<a href="' . $scholar->get('itunes') . '" target="_blank"><img style="height: 45px; margin-bottom: 20px;  margin-top: 20px;" src="images/app-store-badge.svg" /></a>';
					}
				?>
			</div>
		</div>
		<?php
			if($scholar->get('screenshotOne') != null){
		?>
		<div class="container">
			<h1>
				&#63743; <b>WWDC</b>15 Application
			</h1>
			<div id="screenshotsWrap">
				<div id="screenshots">
					<div id="videoArea">
					</div>
					<?php
						$screenshots = array("screenshotOne", "screenshotTwo", "screenshotThree", "screenshotFour");
						foreach($screenshots as $shot){
							if($scholar->get($shot) != null){
								echo '<img src="' . $scholar->get($shot)->getURL() . '">';
							}
						}

						if($scholar->get('githubLinkApp') != null) {
							echo '<a href="' . $scholar->get('githubLinkApp') . '" target="_blank"><img id="github" src="images/fork-github.png" style="margin-left: 25px; height: 200px; margin-bottom: 200px;" /></a>';
						}
					?>

				</div>
			</div>
		</div>
		<?php
			}
		?>
		<div id="footer">
                        <p>
                                <b>&#63743; WWDC</b> 15 Scholars is not affiliated with Apple Inc. in any way. It is made by a group of the Apple Scholarship Winners.
                        </p>
                </div>
		<script src="//www.youtube.com/player_api"></script>
		<script>
			var player;
			var id;
			function onYouTubePlayerAPIReady() {
				var ytURL = '<?php echo $scholar->get('videoLink'); ?>';
			    	if (ytURL.length > 0 && document.body.clientWidth > 510) {
					id = extractParameters(ytURL)["v"];
					document.getElementById("videoArea").style.display = "inline-block";
			   	}
				player = new YT.Player('videoArea', {
					height: '400',
					width: '600',
		  			videoId: id,
					playerVars: {
            					'controls': 1,
						'autoplay': 0
					},
					events: {
						'onReady': onPlayerReady
					}
				});
			}
			document.getElementById("videoArea").style.display = "none";
			function onPlayerReady(event) {
				var ytURL = '<?php echo $scholar->get('videoLink'); ?>';
				if (ytURL.length > 0 && document.body.clientWidth > 510) {
					var id = extractParameters(ytURL)["v"];
					document.getElementById("videoArea").style.display = "inline-block";
					// player.loadVideoById(id);
        	       			// event.target.playVideo();
				}
			}
			function extractParameters(url) {
				var query = url.match(/.*\?(.*)/)[1];
				var assignments = query.split("&");
				var pair, parameters = {};
				for (var ii = 0; ii < assignments.length; ii++) {
					pair = assignments[ii].split("=");
					parameters[pair[0]] = pair[1];
				}
				return parameters;
			}
		</script>
	</body>
</html>
