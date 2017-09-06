# interjet-connector
#### Simple Cross-Domain Messaging Library <br>

Description: <br>
Simple abstraction to the postMessage method. <br>
This library allows to send / receive messages to / from any domain
##### Basic usage
Include the library in your document: 
```html
<script src="interjet.connector.js"></script>
```
Initialize the library:
```js
var connector = new Interjet.Connector({
    onMessage: function(event){
        // Do something with the remote service provider response
        if(!!event.data.success) {
            alert('The remote service provider is awesome');
        } else {
            alert('Houston, we have a problem');
        }
    }
});
```
Send the message (any data type):
```js
connector.send({
    id: '5548158',
    role: 'admin',
    key: 'fE4Vg688c_76E78B5vo8u'
});
```
##### Tips and tricks
Send the message back to the source of the message:
```js
var connector = new Interjet.Connector({
    autoLoad: false, // Initiate the library without a connector
    provider: false, // Initiate the library without a provider
    onMessage: function(event){
        // Do your magic here
        this.send({success: true}, event.source); // Send the message to the source
    }
});
```
Send multiple messages at once:
```js
connector.addQueueMessage('My first message');
connector.addQueueMessage('My second message');
connector.send();
```
Or:
```js
connector.addQueueMessages([
    'My first message', 
    'My second message', 
    'My third message'
]);
connector.send();
```