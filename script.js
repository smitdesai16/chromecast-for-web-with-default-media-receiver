var session = null;

$( document ).ready(function(){
    //starting session
    var loadCastInterval = setInterval(function(){
        if (chrome.cast.isAvailable) {
            console.log('Cast has loaded.');
            clearInterval(loadCastInterval);
            initializeCastApi();
        } else {
            console.log('Unavailable');
        }
    }, 1000);

    
    function initializeCastApi() {
        var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
        var sessionRequest = new chrome.cast.SessionRequest(applicationID);
        var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
        chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
    };

    function sessionListener(e) {
        session = e;
        console.log('New session');
        if (session.media.length != 0) {
                console.log('Found ' + session.media.length + ' sessions.');
        }
    }

    function receiverListener(e) {
        if( e === 'available' ) {
                console.log("Chromecast was found on the network.");
        }
        else {
                console.log("There are no Chromecasts available.");
        }
    }

    function onInitSuccess() {
        console.log("Initialization succeeded");
    }

    function onInitError() {
            console.log("Initialization failed");
    }




    
    //starting cast
    $('#castme').click(function(){
            launchApp();
    });

    function launchApp() {
        console.log("Launching the Chromecast App...");
        chrome.cast.requestSession(onRequestSessionSuccess, onRequestSessionError);
    }
    
    function onRequestSessionSuccess(e) {
        console.log("Successfully created session: " + e.sessionId);
        session = e;
    }

    function onRequestSessionError() {
        console.log("Error connecting to the Chromecast.");
    }


    

    //casting image
    $('#image').click(function(){
        loadImage();
    });

    function loadImage() {
        if (!session) {
            console.log("No session.");
            return;
        }

        var mediaInfo = new chrome.cast.media.MediaInfo('https://www.google.com/logos/doodles/2021/celebrating-laura-bassi-6753651837109199-l.png', 'image/png');
  
        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.autoplay = true;

        session.loadMedia(request, onLoadSuccess, onLoadError);
    }

    


    //casting audio
    $('#audio').click(function(){
        loadAudio();
    });

    function loadAudio() {
        if (!session) {
            console.log("No session.");
            return;
        }

        var mediaInfo = new chrome.cast.media.MediaInfo('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'audio/mpeg');
  
        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.autoplay = true;

        session.loadMedia(request, onLoadSuccess, onLoadError);
    }








    //casting video
    $('#video').click(function(){
        loadVideo();
    });

    function loadVideo() {
        if (!session) {
            console.log("No session.");
            return;
        }

		var mediaInfo = new chrome.cast.media.MediaInfo('http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4', 'video/mp4');
		var request = new chrome.cast.media.LoadRequest(mediaInfo);

        session.loadMedia(request, onLoadSuccess, onLoadError);
    }

	$('#playPauseVideo').click(function(){
		if(session.media[0]) {
			switch(session.media[0].playerState) {
				case 'PLAYING':
					session.media[0].pause();
					break;

				case 'PAUSED':
					session.media[0].play()
					break;
			}
		}
    });

	$('#stopVideo').click(function(){
		if(session.media[0]) {
			session.media[0].stop();
		}
    });





    
    //success error in loadMedia
    function onLoadSuccess() {
        console.log('Successfully loaded.');
    }

    function onLoadError() {
        console.log('Failed to load.');
    }





    //ending session
    $('#stop').click(function(){
        stopApp();
    });

    function stopApp() {
        session.stop(onStopAppSuccess, onStopAppError);
    }

    function onStopAppSuccess() {
            console.log('Successfully stopped app.');
    }

    function onStopAppError() {
            console.log('Error stopping app.');
    }
});