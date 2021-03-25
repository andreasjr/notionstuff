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
        'slideshow',
        'toc'
    ],
    lightbox: $('<div class="n-lightbox"></div>'),
    lightstrip: []
};

pageModules.loadLightbox = function() {
  $('body').prepend(pageModules.lightbox);
  
  $(pageModules.lightbox).append('<div class="n-lightbox__blocker"></div>').on("contextmenu",function(){
       return false;
    }); 
  $(pageModules.lightbox).append('<span id="n-lightbox__close"><a>Close Lightbox &times;</a></span>')

  $(pageModules.lightbox).on("click", function(){
    $(this).addClass('closing');
    thisI = this;
    setTimeout(function() {
        $(thisI).removeClass('open');
        $(thisI).find('img').remove();
        $(thisI).removeClass('closing');
    },700);
  })
}

pageModules.clearHeader = function(){
    $(pageModules.root).removeClass('loaded'); //unload page
    $(pageModules.parentClasses).each(function(index){
        $(pageModules.root).removeClass('contains-' + pageModules.parentClasses[index])
        //console.log(pageModules.parentClasses[index])
    })
}

pageModules.addTitle = function(content, target) {
    if(content.hasOwnProperty('title')) {
        $(target).find('> .notion-text__children').prepend('<div class="notion-text n-text-title"><p class="notion-text__content"><span class="notion-semantic-string"><strong>' + content.title + '</strong></span></p></div>');
    }
}

pageModules.addVideoBackground = function(videoID, parent) {
    var parentX = $(parent).outerWidth(true);
    var parentY = $(parent).outerHeight(true);
    var parentRatio = parentX/parentY;
    var vidRatio = 16/9;
    var dimX, dimY;

    //console.log('video parent: ' + parentX + ' x ' + parentY);
    
    if (vidRatio > parentRatio) { //If Parent Height is larger than Parent Width
        //console.log('Height greater than width')
        $(parent).addClass('n-backgroundvideo__focuswidth');
        dimX = parentY * vidRatio;
        dimY = parentY;

    }
    else {//If Parent Width is larger than Parent Height
        //console.log('Width greater than height')
        $(parent).addClass('n-backgroundvideo__focuswidth');
        dimX = parentX;
        dimY = parentX * vidRatio;
    }
        //console.log('iFrame dimension: ' + dimX + ' x ' + dimY)

    return $('<div class="n-backgroundvideo"><div class="videoblocker"></div><iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" id="nysics-videobackground-iframe" type="text/html" src="https://www.youtube.com/embed/'+videoID+'?playlist='+videoID+'&autohide=1&autoplay=1&controls=0&enablejsapi=1&iv_load_policy=3&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0&wmode=opaque&widgetid=1&mute=1&origin=http://nysics.com" style="width:' + dimX + 'px; height:' + dimY + 'px;"></iframe></div>');

}
pageModules.addImageBackground = function(imageURL, parent) {

  var nBGImage = $('<div class="n-backgroundimage"><div class="imageblocker"></div>'); //Structure


  var image;
  //return;

  if (imageURL == 'first') {
    var thisimageContainer = $(parent).find('.notion-image').first();
    $(nBGImage).append(thisimageContainer);
  }
  else if (imageURL == 'header') {
    var headerSrc = $('.notion-header__cover.has-cover img').first().attr('src');
    if (headerSrc != '' && headerSrc != undefined) {
      $(nBGImage).append('<img src="'+headerSrc+'" class="toplevelimg">');
    }
  }
  else $(nBGImage).append('<img src="'+imageURL+'" class="toplevelimg">');
  

  /* Structure */


  return nBGImage;

}

pageModules.jsonParse = function(jsonPrep, parent) {
    try {
    json = JSON.parse(jsonPrep);

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


        //Background Image Style
        if (json.styles.hasOwnProperty('backgroundImage') && json.styles.backgroundImage != "") {
            $(parent).addClass('contains-backgroundimage');
            $(parent).append(pageModules.addImageBackground(json.styles.backgroundImage, parent));
        }
        
        //Background Video Style
        if (json.styles.hasOwnProperty('backgroundVideo') && json.styles.backgroundVideo != "") {
            $(parent).addClass('contains-backgroundvideo');
            var bgVid = json.styles.backgroundVideo;
            setTimeout(function() {
              $(parent).append(pageModules.addVideoBackground(bgVid, parent));
            }, 100);
            
            setTimeout(function() {
              $(parent).addClass('n-backgroundvideo__loaded');
            },2000);
        }
        

        //Text Position Styles
        if (json.styles.hasOwnProperty('textPosition') && json.styles.textPosition != "") {
          //console.log("Type of: "+ typeof(json.styles.textPosition))
          var textChildren = $(parent).find('.notion-text__children');

          if (typeof(json.styles.textPosition) == "object") {

            
            var css = {};
            var x,y,transformX,transformY;


            //Prepare absolute positioning
            if (json.styles.textPosition[0] == 'center') { //if variable 0 is center, do this
              x = 'left'; //force positioning to left
              transformX = "-50%";
              css[x] = "50%"
            }
              else { //otherwise, left or right positioning will be the same (zero)
                x = json.styles.textPosition[0]; // get 'left' or 'right'
                transformX = "0px";
                css[x] = "0px"
              }

            if (json.styles.textPosition[1] == 'middle') { //if variable 1 is middle, do this
                y = 'top'; //force positioning to top
                transformY = "-50%";
                css[y] = "50%"
            }
              else { //otherwise top and bottom positioning will be the same (zero)
                y = json.styles.textPosition[1]; //get 'top' or 'bottom'
                transformY = "0px";
                css[y] = "0px"
              }

            css["transform"] = 'translateX(' + transformX + ') translateY(' + transformY + ')';
            css["position"] = "absolute";
            //console.log("css: " + css.transform);

            //Set absolute positioning
            $(textChildren).addClass('custom-text-position')
            $(textChildren).css(css);
          }
        }

        //Text Alignment Styles
        if (json.styles.hasOwnProperty('textAlign') && json.styles.textAlign != "") {
          var textChildren = $(parent).find('.notion-text__children').css('textAlign', json.styles.textAlign);
        }




        // If n-type equals what's in pageModules.parentClasses, add "contains-x" to body
        $(pageModules.parentClasses).each(function(i){
            if(json.type == pageModules.parentClasses[i]) {
                $(pageModules.root).addClass('contains-' + pageModules.parentClasses[i]);
            }
        })

    }
    }
    catch { return; }
}

/* Search the page for a json string, pass it to JSON parse */
pageModules.search = function() {
    $('.notion-root .notion-text').each(function(index) { //search for special modules
        
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

    $('.notion-root .notion-callout').has('.notion-semantic-string > span:only-child a').addClass('contains-link');
    
    /* Add Images to Lightbox */
    //pageModules.lightbox = [];
    $('img').each(function(index) {
        //Add to Lightstrip
        //pageModules.lightbox.push(this);

      //Open Lightbox
        $(this).on("click", function() {
            $(pageModules.lightbox).append('<img src="'+$(this).attr('src') + '">');
            $(pageModules.lightbox).addClass('open');
        })
    });


    /* Adjust Table of Contents */
    if ($('ul.notion-table-of-contents.bg-purple').length) {
      $('body').addClass('contains-toc');
    }
}


var loadPage = function() {
    //setTimeout(function(){
    var doc = $(pageModules.root).addClass('loaded');
    //},100);
}


var navload = function() {
  $('.notion-navbar').remove();
  var next = $('#__next > div');
  var nysicsNav = $('<div class="nysics-navbar"></div>');
  var navlist = $('<ul class="navlist"></ul>');
  
  var linkListCont = $('<li class="linklistcont"></li>');
  var linkList = $('<ul class="linklist"></ul>').click(function() {
    $(this).removeClass('visible');
  });
  

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

  /* Add Logo */ $(navlist).append('<li class="nysics-logo"><a href="/" class="notion-link link">' + nConfig.navbarLogo + '</a></li>');
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
    pageModules.loadLightbox();
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
