function Hansel() {       
 
   	this.results;
   	this.timeout = null;    
	this.request = (window.XMLHttpRequest)?(new XMLHttpRequest()):(new ActiveXObject("Microsoft.XMLHTTP"));
 	this.start = new Date().getTime();

	this.processRequestChange = function () {
		if(this.request.readyState != 4)
		{
			return;
		}
		
		this.results = JSON.parse(this.request.responseText);
		window.clearInterval(this.timeout);
		this.onResponseEnd();

		if (!isNaN(this.results.nextUpdate) && this.results.nextUpdate > 3000)
		{
			instance = this;
			this.timeout = window.setInterval(function () { instance.poller(); }, this.results.nextUpdate);  
		}
	};
	 
     
	this.poller = function () {
		
		if (this.request && this.request.readyState < 4) {
            this.request.abort();        
        }

        var sessionId = (this.results !== undefined)?this.results.sessionId:null;
        var hitId = (this.results !== undefined)?this.results.hitId:null;
		var msg = {"sessionId": sessionId, "hitId": hitId, "top" : (new Date().getTime() - this.start), "title" : document.title};
		
		instance = this;
		this.request.onreadystatechange = function() {
			instance.processRequestChange();
		};
		
		this.request.open("POST", "request", true);
        this.request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		
		this.request.send(JSON.stringify(msg));
        
    };

	this.onResponseEnd  = function() {
		document.getElementById('sessionId').innerHTML = this.results.sessionId;
		document.getElementById('hitId').innerHTML = this.results.hitId;
		document.getElementById('nextRefresh').innerHTML = this.results.nextUpdate;
	};
  
}
 
var hanselInstance = new Hansel();


if (window.attachEvent) {window.attachEvent('onload', function () {
  hanselInstance.poller();	
});}
else if (window.addEventListener) {window.addEventListener('load', function () {
  hanselInstance.poller();	
}, false);}

if (window.attachEvent) {window.attachEvent('onunload', function () {
  hanselInstance.poller();	
});}
else if (window.addEventListener) {window.addEventListener('unload', function () {
  hanselInstance.poller();	
}, false);}



