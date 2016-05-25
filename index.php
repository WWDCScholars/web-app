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
	use phpHTML\UICore\UIParagraph;

	require_once('phpUI/autoloader.php');
	require_once "server_conf.php";

	$content = new UIHeading(2, 'WWDC Scholars');
	$scholars_container = new UIDiv([], [], 'scholars_div');

	$scholars_list = json_decode(file_get_contents($API_URL));
	var_dump($scholars_list[0]);
	$i = 0;
	foreach($scholars_list as $scholar){
		$scholar_view = new UIDiv(
			[
				new UIImage($scholar->profilePic),
				new UIParagraph($scholar->firstName . ' ' . $scholar->lastName)
			], ['scholar_overview', 'col-xs-6', 'col-sm-4', 'col-md-3', 'col-lg-2']
		);

		foreach($scholar->batchWWDC as $year){
			$scholar_view->addClass($year);
		}

		$scholars_container->addContent($scholar_view);

		$i++;
		if($i >= 24){
			break;
		}
	}
	$content .= $scholars_container;
	
	require_once('placeholder_page.php');