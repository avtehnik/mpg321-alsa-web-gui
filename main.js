var volume = 0; 

	function loadData(action,value,target){
		new Request.JSON({
			'url':'server.php',
			'data':{
				'action':action,
				'value':value
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
				}
			}
		}).post();
	};

function getTask(el){
	return {
		'action':el.get('data-action'),
		'value':el.get('data-value')
	}
}



document.addEvent('domready',function(){
	loadData('palylist','', document.id('explorer'));
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
		document.id('volume-level').set('html',volume+'%');
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
});


