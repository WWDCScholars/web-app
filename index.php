<?php
	/**
	 * Created by PhpStorm.
	 * User: Oliver
	 * Date: 08/05/2016
	 * Time: 12:37
	 */
	use phpHTML\JSCore\JSObject;
	use phpHTML\UICore\UIDiv;
	use phpHTML\UICore\UIImage;
	use phpHTML\UICore\UILink;
	use phpHTML\UICore\UIParagraph;

	require_once('phpUI/autoloader.php');
	require_once "server_conf.php";

	//$content = new UIHeading(2, 'WWDC Scholars');
	$scholars_container = new UIDiv([], [], 'scholars_div');

	$scholars_list = json_decode(file_get_contents($API_URL . '?batchWWDC=WWDC16'));

	$i = 0;
	foreach($scholars_list as $scholar){
		$info = $scholar->scholarsInfo;

		$batch = $scholar->batch[0];
		$pic = isset($batch->profilePic)?$batch->profilePic:null;

		if($pic == null){
			continue;
		}

		$scholar_view = new UILink(new UIDiv(
			[
				new UIDiv([
					new UIImage($pic),
					new UIParagraph($info->firstName)
				], 'scholar_square')
			], ['scholar_overview', 'col-xs-6', 'col-sm-4', 'col-md-3', 'col-lg-2']
		), 'detail_view.php?id='.$info->_id);

		$scholars_container->addContent($scholar_view);
	}
	$content = $scholars_container;
	$content .= new JSObject('var scholarsLoaded = 24;');

	require_once('placeholder_page.php');
