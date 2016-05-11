<?php
	use phpHTML\JSCore\JSObject;
	use phpHTML\UICore\UIDiv;
	use phpHTML\UICore\UILink;
	use phpHTML\UICore\UIPage\UINav;
	use phpHTML\UICore\UIPage\UIPage;
	use phpHTML\UICore\UIPage\UIPageBody;
	use phpHTML\UICore\UIPage\UIPageHead;

	require_once('phpUI/autoloader.php');

	echo new UIPage(
		new UIPageHead('WWDC Scholars', ['bootstrap/dist/css/bootstrap.min.css','styles/general.min.css'], ['<meta>']),
		new UIPageBody(
			[
				new UINav(
					new UILink('<span class="red">W</span><span class="green">W</span><span class="pink">D</span><span class="orange">C</span><span class="blue">Scholars</span>', '', '', '', '', 'navbar-brand'), [], [
					new UILink('Winners'),
					new UILink('Blog'),
					new UILink('Credits', 'our_team.php'),
					new UILink('Submit')
				], [], UINav::FIXED_NONE, true, true),
				new UIDiv(isset($content)?$content:'', 'container-fluid')
			],
			[JSObject::libraryLink('JQuery', '2.2.3'), 'bootstrap/dist/js/bootstrap.min.js']
		)
	);