var OneSignal = window.OneSignal || [];
if (OneSignal.installServiceWorker) {
  OneSignal.installServiceWorker();
} else {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/OneSignalSDKWorker.js?appId=e0ffda7d-3642-46f4-bbe1-6cbcec752ba8');
  }
}

OneSignal.push(function() {
	console.log('test');
	OneSignal.on('subscriptionChange', function(isSubscribed) {
	      if (isSubscribed) {
	      OneSignal.getUserId( function(userId) {
	        $.ajax({
	        	type: 'POST',
	        	data: {
	        		action: 'savePlayerId',
	        		id: userId
	        	},
	        	success: function(data){
	        		console.log(data);
	        	}
	        });
             });
	    }
     });
});

//register sync event
navigator.serviceWorker.ready.then(function(registration){
  registration.sync.register('send-messages');
})




if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});
