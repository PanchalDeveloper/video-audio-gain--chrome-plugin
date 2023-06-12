function applyAudioGain(gain, video) {
    const audioCtx = video.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    
    if (video.gainNode) {
      video.gainNode.gain.value = gain;
    } else {
      const source = audioCtx.createMediaElementSource(video);
      const gainNode = audioCtx.createGain();
      
      gainNode.gain.value = gain;
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      video.gainNode = gainNode;
      video.audioCtx = audioCtx;
    }
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "applyGain") {
      const { gain, videoQuerySelector } = request;
      const videos = document.querySelectorAll(videoQuerySelector);
  
      if (videos.length > 0) {
        videos.forEach((video) => {
          applyAudioGain(gain, video);
        });
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, message: "Video element(s) not found." });
      }
    }
  });
  