<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />

<link rel="stylesheet" type="text/css" href="bootstrap.min.css" />
<link rel="stylesheet" type="text/css" href="style.css" />
	  
<script src="mootools-core.js"></script>
<script src="main.js"></script>

</head>
<body>
<h1>Player</h1>
<div class="control-group" >
<div id="payingtime" >none</div>
<h3 id="paying" >none</h3>
</div>

<div class="control-group" >
	<button  class="btn btn-success btn-large" data-action="stop" >Stop</button>
	<button  class="btn btn-success btn-large" data-action="palylist" >Reload</button>
</div>
	<div class="control-group" id="explorer" >  </div>
<div class="control-group" >Volume <span id="volume-level" >0%</span>
	<button  class="btn btn-info btn-large" data-action="volume" data-value="minus" >-</button>
	<button  class="btn btn-info btn-large" data-action="volume" data-value="plus" >+</button>
	<button  class="btn btn-info btn-large" data-action="mute" data-value="off" id="mutebtn" >Mute</button>
</div>
	
	
</body>
</html>