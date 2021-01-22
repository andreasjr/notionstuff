/* JS */

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}


var loadPage = function() {
    var doc = document.getElementById('__next');
    setTimeout(()=> {
    doc.classList.add('loaded');
    },500);
}

var loadHeaderVideo = function() {
    loadPage();
    var header = document.getElementById('block-6e10a4d70e824f789ef6c6b5b76b0632');
    if(header != undefined && header != null) {
        var homeheader = document.getElementsByClassName('notion-header')[0].classList.add('home');

        var input = header.getElementsByTagName('p')[0].innerText;
        input = input.slice(2, input.length-1);
        console.log(input);
        json = JSON.parse(input);
        console.log(json.videoBackground)

        var iframe = createElementFromHTML('<div class="nysics-videobackground"><div class="videoblocker"></div><iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" type="text/html" src="https://www.youtube.com/embed/'+json.videoBackground+'?playlist='+json.videoBackground+'&autohide=1&autoplay=1&controls=0&enablejsapi=0&iv_load_policy=3&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0&wmode=opaque&widgetid=1"></iframe></div>');

        header.appendChild(iframe);
    }
    else {
        var homeheader = document.getElementsByClassName('notion-header')[0].classList.remove('home');
    }

}

window.addEventListener('load', (event) => {
    loadHeaderVideo();
    var bT = document.getElementsByClassName('notion-text');
    console.log(bT.length)
    for (var i = 0; i > bT.length; i++) {
        x = bT[i];
        if (x.includes('[header]')) {
        alert ('found')
        }
    }
})


//Detect page load changes going backwards
window.onpopstate = history.onpushstate = function(e) {
    document.getElementById('__next').classList.remove('loaded');
    setTimeout(()=> {
    loadHeaderVideo();
    }, 500);
}


//Detect page load changes going forward from https://stackoverflow.com/questions/53303519/detect-an-url-change-in-a-spa
var pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);

    document.getElementById('__next').classList.remove('loaded');
    
    setTimeout(()=> {
    loadHeaderVideo();
    }, 500);
};