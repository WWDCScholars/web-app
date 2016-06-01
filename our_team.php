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

	$content = new UIDiv([new UIDiv([], 'team-image-gradient')], 'team-image');
	$content.= new UIHeading(3, 'Our Team');
	$content.= new UIParagraph([new UISpan('let', 'pink'),' ourGoal = ', new UISpan('"Bring together scholars from across the world!"', 'red')], 'code');

	$scholars = [
		'56fc2ddaa5ac14970921ad6a' => [''], //Matthijs
		'56fc24dc5840978d849822b2' => ['Web'], //Oliver
		'56fc3d96a5ac14970921ad7a' => [''], //Michie
		'56fc25ee5840978d849822b3' => [''], //Andrew
		'56fc3b1ba5ac14970921ad78' => [''] //Sam
	];

	$row = new UIDiv([], 'row');
	foreach($scholars as $scholar){
		$scholar_view = new UIDiv([], 'col-xs-4');
		$row->addContent($scholar_view);
	}

	$content.=$row;

	require_once('placeholder_page.php');