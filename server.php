<?php
$pidfile = __DIR__.'/mpg321.pid';
$outputfile = __DIR__.'/mpg321.out';


if(isset($_POST['action'])){
	$action = $_POST['action'];
	$value = $_POST['value'];
	if($action=='stop'){
		passthru("killall mpg321");
	}
	
	if($action=='volume'){
		passthru("amixer cset numid=6 ".$value."%");
	}
	
	if($action=='mute'){
		passthru("amixer cset numid=5 ".$value);
	}
	
	if($action=='play'){
		$cmd = 'mpg321 '.$value;
		$command = sprintf("%s > %s 2>&1 & echo $! >> %s", $cmd, $outputfile, $pidfile);
		exec($command);
	}
	if($action=='palylist'){
		$list =  array(
			array('action'=>'play','name'=>'di.fm trance', 'value'=>'http://pub3.di.fm/di_trance' ),
			array('action'=>'play','name'=>'ah.fm', 'value'=>'http://ua.ah.fm:8000/afterhours' ),
		);
	echo json_encode($list);
	}
	

}

?>
