<?php

session_start();
session_id('098f6bcd4621d373cade4e832627b4f6');
session_set_cookie_params(999999);

function addupdate(){
	$data = date('h:i:s');
	$shm_id = shmop_open(0xff3, "c", 0644, 100);
	if (!$shm_id) {
		echo "Ошибка при создании сегмента разделяемой памяти.\n";
	}
	$val = serialize(array('data' => $data));
	shmop_write($shm_id, $val, 0);
	shmop_close($shm_id);
}


function getVolumeLevels(){
	$levels = explode("\n", shell_exec('amixer cget numid=6'));
	$parts = str_replace('  : values=' ,'', $levels['2']);
	$decoded = array();
	$result = explode(',',$parts);
//	$decoded = $result;
	$decoded['frontl'] = round((($result['0']/197)*100),0);
	$decoded['frontr'] = round((($result['1']/197)*100),0);
	$decoded['rearl'] = round((($result['2']/197)*100),0);
	$decoded['rearr'] = round((($result['3']/197)*100),0);
	$decoded['center'] = round((($result['4']/197)*100),0);
	$decoded['woofer'] = round((($result['5']/197)*100),0);
	$decoded['sider'] = round((($result['6']/197)*100),0);
	$decoded['sidel'] = round((($result['7']/197)*100),0);
	return $decoded ;
}

function getMute(){
	$levels = explode("\n", shell_exec('amixer cget numid=5'));
	$parts = str_replace('  : values=' ,'', $levels['2']);
	return $parts == "off" ;
}

function getPid($file){
	if(is_file($file)){
		return file_get_contents($file);
	}
	return false;
}

function rmPid($file){
	if(is_file($file)){
		unlink($file);
	}
}

function getPlaying(){
	$play = isset($_SESSION['nowplaying'])? $_SESSION['nowplaying']:array('name'=>false,'time'=>time()) ;
	$play['time'] = time() - $play['time'];
	return $play;
}
function setPlaying($file){
	$_SESSION['nowplaying'] = array('name'=>$file ,'time'=>time());
}


function stop($file){
        $pid = getPid($file);
		echo $pid;
		if($pid){
			passthru("kill $pid");
		}else{
			passthru("killall mpg321");
		}
		rmPid($file);
};

function getState(){
	return array(
		'volume' => getVolumeLevels(),
		'mute' =>getMute(),
		'play' =>getPlaying()
	);
}

function getUpdate(){
			$size = 100;

            if (!isset($_SESSION['beforeSSSSS'])) {
                $_SESSION['beforeSSSSS'] = array('data' => '');
            }
            $before = $_SESSION['beforeSSSSS'];
            session_write_close();
            $memoryid = shmop_open(0xff3, "a", 0644, $size);
            $a = 60;
            while ($a > 0) {
                $serialized = shmop_read($memoryid, 0, shmop_size($memoryid));
                $data = unserialize($serialized);
                if (is_array($data)) {
                    if ($data != $before) {
                        session_start();
						session_id('098f6bcd4621d373cade4e832627b4f6');
                        $_SESSION['beforeSSSSS'] = $data;
                        shmop_close($memoryid);
						exit(json_encode(getState()));
                    }
                }
                usleep(500000);
                $a--;
            }
            shmop_close($memoryid);
            exit;
}


?>