var volume =0;
var volumeData = {
	frontl:0,
	frontr:0,
	rearl:0,
	rearr:0,
	center:0,
	woofer:0,
	sider:0,
	sidel:0
}; 

	function toFormattedTime(input){
        input = Math.ceil(input); // На случай, если дробное
        var hoursString = '00';
        var minutesString = '00 ';
        var secondsString = '00';
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        hours = Math.floor(input / (60 * 60));
        input = input % (60 * 60);
        minutes = Math.floor(input / 60);
        input = input % 60;
        seconds = input;
        hoursString = (hours >= 10) ? hours.toString() : '0' + hours.toString();
        minutesString = (minutes >= 10) ? minutes.toString() : '0' + minutes.toString();
        secondsString = (seconds >= 10) ? seconds.toString() : '0' + seconds.toString();
        return hoursString + ':' + minutesString + ':' + secondsString;
    }

	function updateVolume(){
		var localvolume = (volumeData.frontl+volumeData.frontr)/2;
		volume = localvolume;
		document.id('volume-level').set('html',volume+'%');
	};

	function updatePayingTime(time){
		document.id('payingtime').set('html',time);
	}
	
	
	var intervalid ;
	
	
	function updatePaying(paying){
		if(paying.name){
			clearInterval(intervalid);
 		    intervalid = window.setInterval(function(){
				paying.time++;
				updatePayingTime(toFormattedTime(paying.time));
			}, 1000);
			document.id('paying').set('html',paying.name);
			updatePayingTime(toFormattedTime(paying.time));
		}else{
			clearInterval(intervalid);
			document.id('paying').set('html','not playing');
			updatePayingTime('00:00:00');
		}
	}
	
	function updateMute(type){
	var mute = document.id('mutebtn');
		if(type){
			mute.removeClass('btn-info');
			mute.addClass('btn-danger');
			mute.set('data-value','on');
		}else{
			mute.removeClass('btn-danger');
			mute.addClass('btn-info');
			mute.set('data-value','off');
		}
	}
	

	function updateSate(data){
		volumeData = data.volume;
		updatePaying(data.play);
		updateMute(data.mute);
		updateVolume();
	}



	function loadData(action,value,target){
		new Request.JSON({
			'url':'server.php',
			'data':{
				'action':action,
				'value':value?value:'stop'
			},
			onSuccess:function(data){
				if(action=='palylist'){
				target.set('html','');
					data.each(function(el){
						new Element('div',{
							'class':'btn btn-large',
							'html':el.name,
							'data-action':el.action,
							'data-value':el.value,
						}).inject(target);
					})
				}else if(action=='playerstate'){
					updateSate(data);
				}
				
			}
		}).post();
	};

	
	function updateWindow(action,value,target){
		new Request.JSON({
			'timeout':10000,
			'url':'server.php?update=true',
			'data':{
				'action':'playerstate',
				'value':value?value:false
			},
			onSuccess:function(data){
				updateSate(data);
				updateWindow();
				//loadData('getvolumes');
			},
			onFailure:function(data){
				updateWindow();
			},
		}).get();
	};
	
	
	
function getTask(el){
	return {
		'action':el.get('data-action'),
		'value':el.get('data-value')
	}
}



document.addEvent('domready',function(){
	loadData('palylist','', document.id('explorer'));
	loadData('playerstate','all', document.id('explorer'));
	updateWindow();
});


document.addEvent('click',function(e){

	var task = getTask(e.target);
	if(task.action=='volume'){
		if(task.value=='plus'){
			volume++;
			if(volume>100){
				volume=100;
			}
		}
		if(task.value=='minus'){
			volume--;
			if(volume<0){
				volume=0;
			}
			
		}
//		volumeData.frontl = volume;
//		volumeData.frontr = volume;
		task.value = volume;
	}
	
	if(task.action=='mute'){
		updateMute(task.value=='off');
	}
	loadData(task.action,task.value,document.id('explorer'));
	loadData('playerstate');
	
});


