<?php
	/**
	 * Created by PhpStorm.
	 * User: Oliver
	 * Date: 08/05/2016
	 * Time: 12:37
	 */
	use phpHTML\UICore\UIDiv;
	use phpHTML\UICore\UIHeading;
	use phpHTML\UICore\UIParagraph;
	use phpHTML\UICore\UISpan;

	require_once('phpUI/autoloader.php');
	require_once('server_conf.php');

	$content = new UIDiv([new UIDiv([], 'team-image-gradient')], 'team-image');
	$content.= new UIHeading(3, 'Our Team');
	$content.= new UIParagraph([new UISpan('let', 'pink'),' ourGoal = ', new UISpan('"Bring together scholars from across the world!"', 'red')], 'code');

	$scholars = [
		'56fc25ee5840978d849822b3' => ['iOS', 'watchOS', 'Design', 'Project Management', 'Marketing'], //Andrew
		'56fc2ddaa5ac14970921ad6a' => ['iOS', 'watchOS', 'API', 'Project Management', 'Marketing'], //Matthijs
		'56fc3d96a5ac14970921ad7a' => ['iOS', 'Web', 'Design', 'API', 'Server', 'Project Management', 'Marketing'], //Michie
		'56fc24dc5840978d849822b2' => ['Web', 'Server'], //Oliver
		'56fc3b1ba5ac14970921ad78' => ['iOS', 'watchOS', 'Design', 'Project Management', 'Marketing'], //Sam
		'57313a3f6961057506283eb8' => ['iOS'] //Sebastian
	];

	$row = new UIDiv([], 'row');
	foreach($scholars as $scholar_id => $scholar){
		$scholar_view = new UIDiv([], 'col-xs-4');
		$scholar_data = json_decode(file_get_contents($API_URL . $scholar_id));
		$scholar_view->addContent($scholar_data[0]->scholarsInfo->firstName);

		$row->addContent($scholar_view);
	}

	$content.=$row;

	require_once('placeholder_page.php');