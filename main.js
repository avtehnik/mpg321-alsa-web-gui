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

	function updateVolume(){
	console.log(volumeData);
		var localvolume = (volumeData.frontl+volumeData.frontr)/2;
		console.log(localvolume);
		volume = localvolume;
		document.id('volume-level').set('html',volume+'%');
	};


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
				}else if(action=='getvolumes'){
					volumeData = data;
					updateVolume();
				}
				
			}
		}).post();
	};

	function updateWindow(action,value,target){
		console.log('start');
		new Request.JSON({
			'timeout':10000,
			'url':'server.php?update=true',
			'data':{
				'action':'update',
				'value':value?value:false
			},
			onSuccess:function(data){
				console.log('ssss',data);
				updateWindow();
				loadData('getvolumes');
			},
			onFailure:function(data){
				console.log('eeee');
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
	loadData('getvolumes','all', document.id('explorer'));
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
		if(task.value=='off'){
			e.target.removeClass('btn-info');
			e.target.addClass('btn-danger');
			e.target.set('data-value','on');
		}else{
			e.target.removeClass('btn-danger');
			e.target.addClass('btn-info');
			e.target.set('data-value','off');
		}
	}
	loadData(task.action,task.value,document.id('explorer'));
	loadData('getvolumes');
	
});


