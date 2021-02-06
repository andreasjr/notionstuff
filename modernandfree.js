/* JS */

(()=>{
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}

var pageModules = {
    root: 'body',
    parentClasses: [
        'menunav',
        'hero',
        'slideshow'
    ]
};

pageModules.clearHeader = function(){
    $(pageModules.root).removeClass('loaded'); //unload page
    $(pageModules.parentClasses).each(function(index){
        $(pageModules.root).removeClass('contains-' + pageModules.parentClasses[index])
        console.log(pageModules.parentClasses[index])
    })
}

pageModules.addTitle = function(content, target) {
    if(content.hasOwnProperty('title')) {
        $(target).find('> .notion-text__children').prepend('<div class="notion-text n-text-title"><p class="notion-text__content"><span class="notion-semantic-string"><strong>' + content.title + '</strong></span></p></div>');
    }
}

pageModules.addVideoBackground = function(videoID) {
    return $('<div class="n-backgroundvideo"><div class="videoblocker"></div><iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" id="nysics-videobackground-iframe" type="text/html" src="https://www.youtube.com/embed/'+videoID+'?playlist='+videoID+'&autohide=1&autoplay=1&controls=0&enablejsapi=1&iv_load_policy=3&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0&wmode=opaque&widgetid=1&mute=1&origin=http://nysics.com"></iframe></div>');

}
pageModules.addImageBackground = function(imageURL, parent) {
  var image;

  if (imageURL == 'first') {
    var thisimage = $(parent).find('.notion-text__children img');
    
    image = $(thisimage).attr('src');
    $(thisimage).remove();
  }
  else image = imageURL;
    return $('<div class="n-backgroundimage"><div class="imageblocker"></div><img src="'+image+'"></div>');

}

pageModules.jsonParse = function(jsonPrep, parent) {
    try {
    json = JSON.parse(jsonPrep);
    }
    catch { return; }

    //If the property Type exists
    if(json.hasOwnProperty('type')) {
        // Add 'type' to parent class
        $(parent).addClass('n-'+json.type);
        pageModules.addTitle(json, parent);
        
        // Add Type value as a class to page root if it's in the databank
        $(pageModules.parentClasses).each(function(i){
            if(json.type == pageModules.parentClasses[i]) {
                $(pageModules.root).addClass('contains-' + pageModules.parentClasses[i]);
            }
        })

        //Conditions for certain types

        // Cards
        if (json.type == "card") {
          $(parent).parents('.notion-column-list').addClass('contains-' + json.type)
        }
    }

    //If the property has 'styles'
    if(json.hasOwnProperty('styles')) {

        //Background Color Style
        if (json.styles.hasOwnProperty('backgroundColor')) {
            $(parent).addClass('bg-' + json.styles.backgroundColor)
        }

        //Background Video Style
        if (json.styles.hasOwnProperty('backgroundVideo') && json.styles.backgroundVideo != "") {
            $(parent).addClass('contains-backgroundvideo');
            $(parent).append(pageModules.addVideoBackground(json.styles.backgroundVideo))
        }

        //Background Image Style
        if (json.styles.hasOwnProperty('backgroundImage') && json.styles.backgroundImage != "") {
            $(parent).addClass('contains-backgroundimage');
            $(parent).append(pageModules.addImageBackground(json.styles.backgroundImage, parent))
        }
        
        $(pageModules.parentClasses).each(function(i){
            if(json.type == pageModules.parentClasses[i]) {
                $(pageModules.root).addClass('contains-' + pageModules.parentClasses[i]);
            }
        })

    }
}

/* Search the page for bg-purple, pass it to JSON parse */
pageModules.search = function() {
    $('.notion-root .notion-text').each(function(index) {
        
        var sV = '!${'; // search variable
        
        //See if this block contains a text block with the variable
        var tE = $(this).find(":contains('"+ sV + "')")[0]; // Find first child block with variable
        //console.log($(tE).text());
        
        //TODO: Add catch try block?
        t = $(tE).text(); //Get JUST the text
        if (t.indexOf(sV) >= 0) { //Verify the text does exist. If it does, parse it.
            $(tE).remove(); //Remove the block with the variable
            var t2 = t.indexOf('}');
            var jsonPrep = t.slice(t.indexOf(sV)+3, t.length-1);
            jsonPrep = '{' + jsonPrep + '}';
            
            $(this).addClass('n-module__parent');
            pageModules.jsonParse(jsonPrep, this);
        }
        else return;
        
    })
}


var loadPage = function() {
    //setTimeout(function(){
    var doc = $(pageModules.root).addClass('loaded');
    //},100);
}

var loadHeaderVideo = function() {

    var header = document.getElementById('block-6e10a4d70e824f789ef6c6b5b76b0632');
    if(header != undefined && header != null) {

        //Disable Home Header
        var homeheader = document.getElementsByClassName('notion-header')[0].classList.add('home');

        var homecover = $('.notion-header__cover.has-cover');
        if (typeof(homecover) != undefined && homecover != null) {
            homecover = $('.notion-header__cover img').attr('src');
            //console.log(homecover)
        }
        
        //Parse Information
        var input = header.getElementsByTagName('p')[0].innerText;
        input = input.slice(2, input.length-1);
        //console.log(input);
        json = JSON.parse(input);
        //console.log(json.videoBackground)

        var iframe = createElementFromHTML('<div class="nysics-videobackground"><div class="videoblocker"></div><iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" id="nysics-videobackground-iframe" type="text/html" src="https://www.youtube.com/embed/'+json.videoBackground+'?playlist='+json.videoBackground+'&autohide=1&autoplay=1&controls=0&enablejsapi=1&iv_load_policy=3&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0&wmode=opaque&widgetid=1&mute=1&origin=http://nysics.com"></iframe><img class="nysics-videobackground-img" src="' + homecover +'"></div>');

        header.appendChild(iframe);
    }
    else {
        var homeheader = document.getElementsByClassName('notion-header')[0].classList.remove('home');
    }


}

var navload = function() {
  $('.notion-navbar').remove();
  var next = $('#__next > div');
  var nysicsNav = $('<div class="nysics-navbar"></div>');
  var navlist = $('<ul class="navlist"></ul>');
  
  var linkListCont = $('<li class="linklistcont"></li>');
  var linkList = $('<ul class="linklist"></ul>');
  

  // Link List Parser
  var linkFromArray = function (links) {
    for(let link of links) {
      var target = link[2] ? ' target="' + link[2] +'"' : '';
      var highlight = link[3] ? ' highlight' : '';
      $(linkList).append('<li><a class="notion-link link'+highlight+'" href="'+link[1]+'"'+target+'>'+link[0]+'</a></li>')
    }
  }
  // Create Link List
  if(typeof(nConfig) == undefined) {
      linkFromArray([
        ['Home', '/'],
        ['Services', '/services'],
        ['Short Films', '/short-films'],
        ['Portfolio', '/portfolio'],
        ['Dashboard &#8594;', 'https://dashboard.nysics.com', '_blank'],
        ['Contact', '/contact',,true]
      ]);
      console.log('Clear your cache!');
  }
  else {
    linkFromArray(nConfig.navbarLinks);
  }

  
  $(nysicsNav).append(navlist);

  /* Add Logo */ $(navlist).append('<li class="nysics-logo"><a href="/" class="notion-link link"><svg width="100%" height="100%" viewBox="0 0 640 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-640,-400)"><g transform="matrix(1,0,0,1.32,0,0)"><g id="Logo-Wordmark-Back" serif:id="Logo+Wordmark-Back" transform="matrix(1,0,0,0.757576,440.111,303.114)"><g transform="matrix(3.06429,0,0,3.06429,-14746.4,-831.523)"><g transform="matrix(0.372842,0,0,0.209724,3612.49,-44.2098)"><g transform="matrix(0.6219,0,0,1.1056,225.553,-301.776)"><path d="M5221,1757.12C5224.66,1753.87 5228.99,1751.95 5234.32,1751.95C5246.2,1751.95 5252.62,1758.1 5254.94,1765.34C5259.72,1755.5 5267.37,1751.95 5275.56,1751.95C5289.09,1751.95 5297.55,1760.56 5297.55,1774.08L5297.55,1816.41L5293.32,1816.41L5293.32,1774.76C5293.32,1763.15 5286.63,1755.78 5275.56,1755.78C5267.78,1755.78 5260.54,1759.46 5256.31,1770.25L5256.31,1797.09L5252.07,1799L5252.07,1774.21C5252.07,1763.15 5245.65,1755.78 5234.32,1755.78C5228.97,1755.78 5224.59,1757.9 5221,1761.5L5221,1757.12Z" style="fill:white;fill-rule:nonzero;"/></g><g transform="matrix(0.677618,0,0,1.20465,3441.04,1717.83)"><path d="M0,-86.212L2.006,-86.212L2.006,-75.934C5.641,-82.075 12.784,-86.212 20.431,-86.212C32.589,-86.212 40.36,-77.939 40.36,-65.655L40.36,-9.443L39.42,-9.443L38.354,-9.443L38.354,-65.53C38.354,-77.312 31.085,-84.457 20.431,-84.457C12.534,-84.457 5.515,-79.945 2.006,-73.177L2.006,-26.274L0,-27.177L0,-86.212Z" style="fill:white;fill-rule:nonzero;"/></g></g><g transform="matrix(0.326456,0,0,0.326456,4876.51,272.138)"><path d="M103.476,7.557C126.035,7.665 148.272,16.512 164.656,31.856C192.063,57.523 201.207,100.848 184.511,136.023C170.134,166.31 137.905,187.275 103.766,187.491C61.566,187.759 20.722,155.37 14.17,110.66C10.024,82.365 20.313,52.374 40.93,32.598C57.183,17.01 79.324,7.888 102.023,7.564C102.507,7.559 102.991,7.557 103.476,7.557ZM102.9,9.557C81.081,9.659 59.465,18.15 43.467,32.955C22.745,52.131 12.213,81.634 16.032,109.549C20.931,145.351 49.823,176.639 86.001,183.813C113.483,189.264 143.391,180.709 163.865,161.191C185.019,141.024 195.041,109.839 189.63,81.149C184.437,53.621 165.19,29.105 139.615,17.442C128.151,12.213 115.539,9.537 102.9,9.557Z" style="fill:white;fill-rule:nonzero;"/></g></g><g transform="matrix(1,0,0,1,276.91,-195.086)"><path d="M154.139,315.085L155.4,315.085L155.4,285.93C157.626,281.64 162.076,278.78 167.083,278.78C173.838,278.78 178.448,283.309 178.448,290.776L178.448,315.085L179.709,315.085L179.709,290.696C179.709,282.911 174.792,277.678 167.083,277.678C162.235,277.678 157.705,280.29 155.4,284.182L155.4,278.387L154.139,278.387L154.139,315.085Z" style="fill:white;fill-rule:nonzero;"/><path d="M184.326,332.561C191.633,332.561 196.715,327.884 202.036,315.094L217.046,278.393L215.775,278.393L203.148,309.454L201.56,313.426L199.971,309.454L187.265,278.393L185.915,278.393L200.686,314.538L200.924,315.015C195.842,327.01 191.077,331.459 184.326,331.459L183.691,331.459L183.691,332.561L184.326,332.561Z" style="fill:white;fill-rule:nonzero;"/><path d="M232.462,315.8C239.059,315.8 243.579,311.757 243.579,306.274C243.579,300.95 240.649,297.851 233.495,295.468L232.144,295.07C226.183,293.084 223.798,290.62 223.798,286.488C223.798,282.038 227.455,278.78 233.257,278.78C236.595,278.78 240.331,279.893 243.185,281.721L243.185,280.29C240.251,278.702 236.595,277.678 233.257,277.678C226.66,277.678 222.537,281.323 222.537,286.488C222.537,291.336 225.229,294.117 231.747,296.262L233.177,296.739C239.615,298.805 242.318,301.666 242.318,306.274C242.318,311.122 238.344,314.618 232.462,314.618C228.806,314.618 224.911,313.267 221.822,310.804L221.822,312.234C224.673,314.379 228.488,315.8 232.462,315.8Z" style="fill:white;fill-rule:nonzero;"/><path d="M253.678,263.369L255.733,263.369L255.733,261.314L253.678,261.314L253.678,263.369ZM254.075,315.085L255.336,315.085L255.336,278.383L254.075,278.383L254.075,315.085Z" style="fill:white;fill-rule:nonzero;"/><path d="M283.776,315.8C287.827,315.8 291.878,314.459 295.056,312.393L295.056,310.963C291.878,313.188 287.668,314.618 283.776,314.618C273.766,314.618 267.093,307.625 267.093,296.818C267.093,285.773 273.448,278.86 283.378,278.86C287.43,278.86 291.243,279.972 295.135,282.277L295.135,280.847C291.402,278.781 287.43,277.678 283.378,277.678C272.733,277.678 265.832,285.138 265.832,296.818C265.832,308.261 272.972,315.8 283.776,315.8Z" style="fill:white;fill-rule:nonzero;"/><path d="M313.729,315.8C320.326,315.8 324.846,311.757 324.846,306.274C324.846,300.95 321.916,297.851 314.762,295.468L313.411,295.07C307.45,293.084 305.065,290.62 305.065,286.488C305.065,282.038 308.722,278.78 314.524,278.78C317.862,278.78 321.598,279.893 324.452,281.721L324.452,280.29C321.518,278.702 317.862,277.678 314.524,277.678C307.927,277.678 303.804,281.323 303.804,286.488C303.804,291.336 306.496,294.117 313.014,296.262L314.444,296.739C320.882,298.805 323.585,301.666 323.585,306.274C323.585,311.122 319.611,314.618 313.729,314.618C310.073,314.618 306.178,313.267 303.089,310.804L303.089,312.234C305.94,314.379 309.755,315.8 313.729,315.8Z" style="fill:white;fill-rule:nonzero;"/><path d="M350.833,315.085L353.286,315.085L353.286,286.422C355.749,282.361 359.962,279.734 364.492,279.734C371.088,279.734 374.824,284.033 374.824,290.482L374.824,315.085L377.276,315.085L377.276,288.173C379.74,281.883 383.952,279.734 388.483,279.734C394.92,279.734 398.815,284.033 398.815,290.801L398.815,315.085L401.267,315.085L401.267,290.403C401.267,282.52 396.351,277.519 388.483,277.519C383.714,277.519 379.263,279.576 376.485,285.307C375.14,281.087 371.406,277.519 364.492,277.519C360.041,277.519 355.908,279.813 353.286,283.396L353.286,278.31L350.833,278.31L350.833,315.085Z" style="fill:white;fill-rule:nonzero;"/><path d="M428.918,315.879C433.607,315.879 437.977,314.297 442.42,311.042L442.42,308.339C438.136,311.836 433.766,313.506 428.918,313.506C418.984,313.506 413.66,307.147 413.66,296.655L413.66,296.575L443.212,296.575L443.212,294.361C443.212,283.89 437.262,277.519 427.488,277.519C417.633,277.519 411.128,285.249 411.128,296.655C411.128,308.578 417.315,315.879 428.918,315.879ZM427.488,279.734C435.752,279.734 440.679,285.249 440.679,294.361L413.739,294.361C414.216,285.569 419.779,279.734 427.488,279.734Z" style="fill:white;fill-rule:nonzero;"/><path d="M467.923,315.879C472.532,315.879 476.744,313.902 479.446,310.001L479.763,315.085L481.899,315.085L481.899,257.5L479.446,257.5L479.446,281.406C476.029,278.864 472.294,277.519 468.082,277.519C458.625,277.519 451.483,283.953 451.483,296.692C451.483,309.602 458.386,315.879 467.923,315.879ZM467.923,313.665C459.102,313.665 454.015,307.054 454.015,296.62C454.015,286.424 459.34,279.734 468.082,279.734C472.373,279.734 476.109,281.247 479.446,284.115L479.446,306.416C477.38,310.797 473.248,313.665 467.923,313.665Z" style="fill:white;fill-rule:nonzero;"/><path d="M493.984,264.561L496.992,264.561L496.992,261.552L493.984,261.552L493.984,264.561ZM494.301,315.085L496.754,315.085L496.754,278.383L494.301,278.383L494.301,315.085Z" style="fill:white;fill-rule:nonzero;"/><path d="M517.969,315.879C522.817,315.879 526.712,313.823 529.176,310.008L529.492,315.085L531.708,315.085L531.708,289.091C531.708,281.332 527.109,277.519 519.638,277.519C515.426,277.519 512.008,278.627 508.197,280.772L508.197,283.732C511.929,281.012 515.267,279.893 519.638,279.893C525.599,279.893 529.176,282.692 529.176,289.091L529.176,292.53L520.274,293.485C511.611,294.434 506.535,299.197 506.535,305.472C506.535,311.757 510.816,315.879 517.969,315.879ZM517.969,313.665C512.405,313.665 509.067,310.406 509.067,305.478C509.067,300.232 513.121,296.576 520.592,295.781L529.176,294.829L529.176,306.432C527.268,310.644 523.215,313.665 517.969,313.665Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></g></svg></a></li>');
  $(navlist).append('<li class="nav-divider"></li>')
  $(navlist).append(linkListCont);

  var toggleButton = $('<div id="togglebutton">&#9776;</div>').click(function() {
    $(linkList).addClass('visible');
  });

  $(linkListCont).append(toggleButton)
  $(linkListCont).append(linkList);
  
  var listCloseButton = $('<li class="linklist-close" id="linklist-close"><a>&times; Close Menu</a></li>').click(function(){
    $(linkList).removeClass('visible');
  });
  $(linkList).prepend(listCloseButton);

  $(next).prepend(nysicsNav);
}

var footerLoad = function() {
  var next = $('#__next > div');

  var footerContainer = $('<div class="nysics-footer"></div>');
  var footerListContainer = $('<ul class="footer-listcontainer"></ul>')
  

  $(next).append(footerContainer);
  $(footerContainer).append(footerListContainer);

  var addItems = function(items) {
    for (let item of items) {
      var li = $("<li></li>").append(item);
      $(footerListContainer).append(li);
    }
  }
  
  if(typeof(nConfig) == undefined) {
    addItems(['<p>Made with ♥ in Manchester, NH</p>',
        '<a href="https://dashboard.nysics.com" class="notion-link link">Log into your Client Dashboard</a>',
        '<a href="/about" class="notion-link link">&copy;2021 Nysics Media LLC</a>'
    ])
  }
  else {
    addItems(nConfig.footerLinks);
  }
}



/* This will use MutationObserver to observe the header for any changes; detecting a page load. */
var addMutationListener = function() {

  let superHeader = document.getElementsByClassName('notion-header__title')[0]; //Thing to observe

  //console.log('observe: ' + $(superHeader).attr('id'))

//Gets called whenever page navigation begins
const observer = new MutationObserver(function() {
    pageModules.clearHeader();

    setTimeout(function(){
        pageModules.search();
        loadHeaderVideo();
        loadPage();
        }, 200);
    });

  observer.observe(superHeader, {childList: true, attributes: true, characterData: true, subtree: true});
}

var addFacebook = function() {
    $('body').prepend('<!-- Load Facebook SDK for JavaScript --><div id="fb-root"></div><script>window.fbAsyncInit = function() {FB.init({xfbml: true,version: \'v9.0\'});};(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = \'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js\'; fjs.parentNode.insertBefore(js, fjs);      }(document, \'script\', \'facebook-jssdk\'));</script><!-- Your Chat Plugin code --><div class="fb-customerchat" attribution="setup_tool" page_id="50345695255" theme_color="#24afff" logged_in_greeting="Hi! What kind of video are you trying to make?" logged_out_greeting="Hi! What kind of video are you trying to make?"></div>')
}

/* First Page Load */
window.addEventListener('load', (event) => {
    navload();
    footerLoad();
    loadHeaderVideo();
    pageModules.search();
    addMutationListener();
    addFacebook();
        loadPage();
})


//Detect page load changes going backwards
window.onpopstate = history.onpushstate = function(e) {
    //document.getElementById('__next').classList.remove('loaded');
    /*//setTimeout(()=> {
    loadHeaderVideo();
    //}, 500);*/
}


//Detect page load changes going forward from https://stackoverflow.com/questions/53303519/detect-an-url-change-in-a-spa
var pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);

    //document.getElementById('__next').classList.remove('loaded');
    
    /*//setTimeout(()=> {
    loadHeaderVideo();
    //}, 500);*/
};
})();
