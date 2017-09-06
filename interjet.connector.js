var Interjet = Interjet || {
	Connector: function(options){
		var options = options || {};
		
		this.connector = false;
		this.connectorLoaded = false;
		this.queue = [];

		this.options = {
			provider: 'http://www.interjet.co.il/camp/test/israel/storage/',
			id: 'InterjetConnector',
			origin: null,
			autoLoad: true,
			onMessage: function(e){}
		};

		for(var i in options) {
			this.options[i] = options[i];
		}

		// Check if the request origin matches the provider's origin
		this.handleResponse = function(event){
			if(this.options.origin === event.origin || !this.options.provider) { 
				this.options.onMessage.call(this, event);
			}
		}

		// Parse the origin of the provider
		this.getHostOrigin = function(){
			var parser = document.createElement('a');
			parser.href = this.options.provider;
			this.options.origin = [parser.protocol, parser.host].join('//');
		}

		// Load and append the connector into the DOM
		this.load = function(){
			var ifrm = document.createElement("iframe");
	        ifrm.setAttribute("src", this.options.provider);
	        ifrm.setAttribute("id", this.options.id);
	        ifrm.style.width = "0px";
	        ifrm.style.height = "0px";
	        ifrm.style.border = "0px";
	        document.body.appendChild(ifrm);
	        ifrm.addEventListener('load', function(){
	        	this.connectorLoaded = true;
	        	this.send();
	        }.bind(this));
	        this.connector = ifrm.contentWindow;
		}

		// Add a message to the queue (usefull when you need to send multiple messages at once)
		this.addQueueMessage = function(message){
			this.queue.push(message);
		}

		// Add multiple messages to the queue (usefull when you need to send multiple messages at once)
		this.addQueueMessages = function(messages){
			this.queue.concat(messages);
		}

		/*
		 * Multi purpose method:
		 * Add the given message to the message queue if the connector is not loaded (The message will be sent once the connector will be loaded)
		 * Send the message queue (and empty the queue) if the connector is loaded but no message is provided
		 * Send the given message if the connector is loaded and a message is provided
		*/
		this.send = function(message, connector){
			if(!this.connectorLoaded) {
				this.queue.push(message);
				return;
			}

			var __connector = connector || this.connector;

			if(!message) {
				this.queue.forEach(function(entry, index) {
				    __connector.postMessage(entry, '*');
				    this.queue.splice(index, 1);
				}.bind(this));
			} else {
				__connector.postMessage(message, '*');
			}
		}

		// Bind event to the document.onDOMContentLoaded event handler
		this.ready = function(fn) {
			if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
		    	fn();
		  	} else {
		  		document.attachEvent ? document.attachEvent('onDOMContentLoaded', fn) : document.addEventListener('DOMContentLoaded', fn, false);
		  	}
		}

		// Constructor
		if(this.options.autoLoad && !!this.options.provider) {
			this.ready(this.load.bind(this));
		} else {
			this.connectorLoaded = true;
		}

		// Bind the window to a message receiver
		if (window.addEventListener) {
	  		window.addEventListener("message", this.handleResponse.bind(this), false);
	  	} else {
			window.attachEvent("onmessage", this.handleResponse.bind(this));
		}

		// Determine the host origin
		if(!!this.options.provider) {
			this.getHostOrigin();
		}
	}
};