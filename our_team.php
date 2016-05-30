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
	$content.= new UIHeading(5, 'Our Team');
	$content.= new UIParagraph([new UISpan('let', 'pink'),' ourGoal = ', new UISpan('"Bring together scholars from across the world!"', 'red')], 'code');

	require_once('placeholder_page.php');