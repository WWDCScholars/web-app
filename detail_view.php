<?php
	/**
	 * Created by PhpStorm.
	 * User: Oliver
	 * Date: 08/05/2016
	 * Time: 12:37
	 */
	use phpHTML\UICore\UIDiv;
	use phpHTML\UICore\UIHeading;
	use phpHTML\UICore\UIImage;
	use phpHTML\UICore\UILink;
	use phpHTML\UICore\UIParagraph;

	require_once('phpUI/autoloader.php');
	require_once "server_conf.php";

	$id = isset($_GET['id'])?$_GET['id']:'';

	$scholar = json_decode(file_get_contents($API_URL . $id));
	//var_dump($scholar);

	$embed = new UIDiv("<iframe width='100%' height='200' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?key={$GMAPS_KEY}&q={$scholar->location}' allowfullscreen></iframe>", 'map');

	$date_of_birth = new DateTime($scholar->birthday);
	$now = new DateTime();
	$age = $now->diff($date_of_birth)->format('%y');

	$attended = '';
	$scholar->batchWWDC = array_reverse($scholar->batchWWDC);
	foreach($scholar->batchWWDC as $wwdc){
		if(!empty($attended)){
			$attended .= ', ';
		}
		$attended .= str_replace('WWDC', "'", $wwdc);
	}

	$latest_picture = '';
	for($i = 2012; $i < date('Y'); $i++){
		$var = 'profilePic' . $i;
		$latest_picture = isset($scholar->$var)?$scholar->$var:$latest_picture;
	}

	$scholar_view = new UIDiv([
		new UIDiv(
			new UIDiv([
				new UIImage($latest_picture, ['scholar_centered_photo']),
				new UIHeading(3, [$scholar->firstName, ' ', $scholar->lastName]),
				new UIHeading(5, $scholar->location)
			], ['col-xs-12']),
		'row'),
		new UIDiv([
			new UIDiv([
				new UIHeading(4, 'Age', 'red'),
				new UIHeading(4, $age)
			], 'col-xs-4'),
			new UIDiv([
				new UIHeading(4, 'Gender', 'green'),
				new UIHeading(4, $scholar->gender)
			], 'col-xs-4'),
			new UIDiv([
				new UIHeading(4, 'Attended', 'blue'),
				new UIHeading(4, $attended)
			], 'col-xs-4')
		],'row'),
		new UIDiv([
			new UIDiv(new UIParagraph($scholar->shortBio), 'col-xs-12')
		], 'row')
	], ['scholar_detail', 'center']);



	$links_view = new UIDiv([], ['col-xs-12', 'links']);
	$links = ['itunes', 'github', 'facebook', 'twitter', 'website', 'linkedin', 'email'];
	foreach($links as $link){
		if(isset($scholar->$link)){
			$links_view.= new UILink(new UIDiv('', [$link, 'link']), $scholar->$link, '', '_blank');
		}
	}

	$submissions_view = new UIDiv(new UIDiv([
		new UIHeading(3, 'Submissions')
	], ['col-xs-12', 'submissions']), ['row', 'center']);

	$content = $embed . $scholar_view . new UIDiv($links_view, ['row', 'center']) . $submissions_view;

	require_once('placeholder_page.php');