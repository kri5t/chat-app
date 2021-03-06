# realtime-chat-app
A real time chat application with support for offline mode. This chat application allows the users to go offline while chatting and will sync and save the messages to the server once it goes online again. It stores the state of the app locally and buffers the messages when you go offline.

# Install

`git clone https://github.com/kri5t/chat-app`

`npm install`

`node server.js`

This application assumes there is a local mongodb installed and that the node package manager and node server is installed globally.
If the mongodb is running elsewhere configure the `./server/config.js` to point at your server. You can also change the port by setting the environment variable(`PORT`) when starting the server.

[Demo](http://stoggle.dk:9000/)

# Questions
**What were some of the reasons you chose the technology stack that you did?**

Since I was required to build a real time application Node.js is the perfect fit with its non-blocking io that makes it able to handle a lot of connections while being very efficient with the resources at hand. [Node.js efficiency](http://blog.caustik.com/2012/08/19/node-js-w1m-concurrent-connections/)

On top of Node.js I chose to implement socket.io which creates a websocket connection with the browser and allows for the real time magic to happen. Also I have done a realtime app using Microsofts WebApi2 and SignalR and I wanted to compare the technologies which turned out to be very similar.

At the front end I chose to work with AngularJS because of the module based nature, dependency injection (loose coupling) and reduced boilerplate code.
I chose a web client to make my application accessible on almost every platform and because it is fast to develop and deploy to.

For the backend I chose a mongodb since it is very fast at retrieving the messages and I don't need the relations of a SQL db. Also it works well with the rest of my stack being in javascript.

I chose mongoose as my mongo driver to get a little structure and to communicate my model to the reader. Also I like their chained query language [example](http://mongoosejs.com/docs/api.html#query_Query-where)

**What would you need to do to make this application scale to hundreds of thousands of users?**

Since Node.js and mongodb is very good at handling a lot of concurrent connections I would not need a large setup. I would probably need more node.js servers and a sharded cluster of mongodbs to support my servers. Also I would need load balancers to even out the load on my servers.

My chat application should probably also implement some kind of chat room capability; because 100.000+ in one room can get confusing.

**What were some of the trade offs you made when building this application? Why were these acceptable tradeoffs? **

Right now I am using a hashset(js object) to avoid dupes in the chatlog. And I am doing an old fashioned sort of the array. To make this more efficient I would use a [SortedMap](http://www.collectionsjs.com/sorted-map) instead to avoid dupes and keep the sort order.

I do not listen on the `offline event` from the browser and instead I simulate it by giving the user a button to click. This was done to make testing easier and because the cross browser implementation of the `offline event` is not uniform.

I am only using the local buffer when the button is clicked. If this was to go live I would probably always use the buffer to make sure the message was saved on the server before I remove it locally. This is done to avoid loss of data when going from online to offline mode; since it normally takes some time for the browser to register that.

If this was going to be a serious app test driven development would have been a better approach. Right now I did not have the time to setup the tests and the application but automatic testing is never a good tradeoff.

**Given more time, what improvements or optimizations would you want to add later?**

I have already answered some of this with running buffer, using an array and sorting it to ensure message placement and listening to the offline event.

I would like to add a login functionality; so the messages can be associated to a user when he/she logs back in.

I also thought it would be nice to add a Wunderlist button that can add a chat message to a list in the users wunderlist account.

I would like to add chat rooms to the application using socket io to control it.

If this was a serious project I would need to setup automatic deployment, task runners and bundling e.g. [Browserify](http://browserify.org/)

Last the design is maybe a bit to minimalistic even for a scandinavian like me.

**How did you implement the offline capabilities of the application and why?**

As I stated earlier I implemented the offline capabilities as a button to simulate it. This was done to make testing easier and easier for users to verify that it works. I used the `localstorage` of the browser to store the messages and the state of the app when a user goes offline. I chose the `localstorage` because the state will survive a closed browser; so no messages would be lost. When going back online I use the socket connections to broadcast the messages one-by-one; since I already implemented this. If it turns out to be a bottleneck I would probably go for bulk update after a client has been offline.

**How do you make sure that merging the offline messages with the whole conversation works everytime?**

I use the format:

`YYYY-MM-DDTHH:mm:ss:SSS + a hash of the (username+message)`

This is a sortable format and makes for a unique stamp for the message. I can then use a hashset to avoid duplicates in my data and last I map them into pairs and sort the array. This can be done smarter with some more time and the use of a [SortedMap](http://www.collectionsjs.com/sorted-map)