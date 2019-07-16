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

        var mediaInfo = new chrome.cast.media.MediaInfo('https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg');
        mediaInfo.contentType = 'image/jpg';
  
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

        var mediaInfo = new chrome.cast.media.MediaInfo('https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3');
        mediaInfo.contentType = 'audio/mpeg';
  
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

        var mediaInfo = new chrome.cast.media.MediaInfo('https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4');
        mediaInfo.contentType = 'video/mp4';
  
        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.autoplay = true;

        session.loadMedia(request, onLoadSuccess, onLoadError);
    }






    
    //success error in loadMedia
    function onLoadSuccess() {
        console.log('Successfully loaded image.');
    }

    function onLoadError() {
        console.log('Failed to load image.');
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