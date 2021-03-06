if ("serviceWorker" in navigator) {
	window.addEventListener("load", function () {
		navigator.serviceWorker.register("./sw.js").then(
			function (registration) {

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


