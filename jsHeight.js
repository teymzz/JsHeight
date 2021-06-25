(function($){
  $.fn.jsHeight = function(options){

    //defaults settings
    var defaults = {
      minHeight :false,
      maxHeight :false,
      reduceHeightBy  :0,
      increaseHeightBy  :0,
      autoHeight: false,
      autoResize:false,
      fullHeight: false,
      thisElement: this,
      autoHeightFix: 0
    }

    //real settings
    var settings = $.extend(defaults,options);
    
    //initialize
    runHeight(settings);
    
    // auto resize condition
    if(settings.autoResize === true){
      $(window).on("resize",function(){
       runHeight(settings);
      })             
    }          

  }


  function runHeight(settings){
     var jcHeight;
     var thisElement = settings.thisElement;
     var thisId = thisElement.data("id") || thisElement.attr("id")

     if(settings.autoHeight === true){
       if(thisElement.find(".js-cHeight").length < 1){
        thisElement.children().wrapAll("<div class='js-cHeight'><div>");
        $(thisElement).find(".js-cHeight>div").addClass("js-inHeight").css({'height':'inherit'});
        if(jcHeight = thisElement.data('jcheight')){
          thisElement.find(".js-cHeight").css({'height':jcHeight});
        }

       } 
     }

     //get full window height
     var fullheight = window.innerHeight;
     var thisHeight = thisElement.height();

     //get reduction value
     var thisReduce = settings.reduceHeightBy;
     thisReduce = isNaN(parseFloat(thisReduce))? 0 : parseFloat(thisReduce);

     var thisIncrease = settings.increaseHeightBy;
     thisIncrease = isNaN(parseFloat(thisIncrease))? 0 : parseFloat(thisIncrease);
     
     //get minimum height
     var thisMinHeight = settings.minHeight;

     //tweak minHeight
     if(settings.minHeight == 'screen'){
       thisMinHeight = window.innerHeight;
     }
     thisMinHeight = isNaN(parseFloat(thisMinHeight))? false : parseFloat(thisMinHeight);
    // alert(thisId+":"+thisMinHeight);

     //get maximum height
     var thisMaxHeight = settings.maxHeight;
     thisMaxHeight = isNaN(parseFloat(thisMaxHeight))? false : parseFloat(thisMaxHeight);
     

     //get maximum height
     var aHFix = settings.autoHeightFix || 0;
     aHFix = isNaN(parseFloat(aHFix))? 0 : parseFloat(aHFix);

     //get real height
     var realHeight = fullheight - thisReduce;
     realHeight = realHeight + thisIncrease;  

     var irealHeight;   

     //few tweaks
     if(thisMinHeight != false){ 
       if(fullheight < thisMinHeight){
         realHeight = thisMinHeight; 
       }
       if(thisHeight < thisMinHeight){
         irealHeight = thisMinHeight + thisIncrease - thisReduce;
       }
     }

     if(thisMaxHeight != false){ 
       if(fullheight > thisMaxHeight){
         realHeight = thisMaxHeight;
       }
       if(thisHeight > thisMaxHeight){
         irealHeight = thisMaxHeight + thisIncrease - thisReduce;
       }
     }
    
     var rHeight = realHeight;
     //render element to screen height
      if(settings.fullHeight===true){
         thisElement.css({"height":realHeight});
      }else{
         if(typeof irealHeight != "undefined"){
            thisElement.css({"height":irealHeight});
            rHeight = irealHeight;
         }   
      }

     // child condition
    if(thisElement.find(".js-cHeight").length > 0){ 
       var jscHeight = thisElement.find(".js-cHeight").height();
       var watchDog  = thisElement.find("[data-watch]").height();
       var childHeight  = jscHeight + aHFix;

       if(thisElement.find("[data-watch]").length > 0){ 
          childHeight  = watchDog + aHFix; 
          if(childHeight < rHeight){ childHeight = rHeight }
       }

       //alert(thisElement.attr('id')+"::"+childHeight+"::jsc::"+jscHeight+"::watchDog::"+watchDog)
       //console.log(aHFix);
       
      //console.log(thisElement.attr('id')+childHeight+":"+$(thisElement).find("[data-watch]").height());
    if(settings.autoResize == true || settings.autoResize == "resize"){
      //auto increase parent to match child
      
       if(childHeight > realHeight){
         //console.info({realHeight:realHeight,childHeight:childHeight})
         thisElement.css({"height":childHeight});
        //console.info(thisElement.css("height"))
       }     
     }               
    }else{
      if(thisElement.find("[data-watch]").length > 0){ 
         childHeight  = thisElement.find("[data-watch]").height() + aHFix
         if(thisMinHeight) { childHeight = (childHeight < thisMinHeight)? thisMinHeight : childHeight; }
         if(thisMaxHeight) { childHeight = (childHeight > thisMaxHeight)? thisMaxHeight : childHeight; }

         thisElement.css({"height":childHeight});
      }
      
    } 
  }
})(jQuery);


/*
 autoHeight: increases height to match content height
 autoResize: automatically resize element upon window resize
 reduceHeightBy: reduces the height
 increaseHeightBy: increase the height 
 minHeight: minimum height allowed
 maxHeight: maximum height allowed
 fullHeight: render element to screen height
*/

function jqHeight(options,target){

    function run(timeout){

      var timeout = timeout || 0;

      setTimeout(function(){
        $(target).jsHeight(options);
      },timeout)
    }
    
    run();

    if(options.autoResize == "resize"){
      $(window).on("resize",function(){
        run(200);
      })
    }
}
