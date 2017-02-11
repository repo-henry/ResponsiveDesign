"use strict";
//

jQuery(document).ready(function(){

/*  Carousel Images */
  var $c1 = $("#c1");
  var $c2 = $("#c2");
  var $c3 = $("#c3");
  var $c4 = $("#c4");

  /*  Div to display viewport information */
  var $td = $("#msgDiv");
  var d = new Date();

  function viewportChange() {
  /* force image to load new size
  http://stackoverflow.com/questions/2104949/how-to-reload-refresh-an-elementimage-in-jquery
    */


    if (window.matchMedia("(min-width: 1px)").matches) {
      $td.html("xs, viewport is less than 768px.");
      $td.attr("class", "red");
      $td.css("width", "95%");

      $c1.attr("src", "img/_338x254/1.jpg?"+d.getTime());
      $c2.attr("src", "img/_338x254/2.jpg?"+d.getTime());
      $c3.attr("src", "img/_338x254/3.jpg?"+d.getTime());
      $c4.attr("src", "img/_338x254/4.jpg?"+d.getTime());
    }

    if (window.matchMedia("(min-width: 768px)").matches) {
      $td.html("sm, viewport is greater than 768px.");
      $td.attr("class", "green");
      $td.css("width", "96%");

      $c1.attr("src", "img/_512x384/1.jpg?"+d.getTime());
      $c2.attr("src", "img/_512x384/2.jpg?"+d.getTime());
      $c3.attr("src", "img/_512x384/3.jpg?"+d.getTime());
      $c4.attr("src", "img/_512x384/4.jpg?"+d.getTime());
    }

    if (window.matchMedia("(min-width: 992px)").matches) {
      $td.html("md, viewport is greater than 992px.");
      $td.attr("class", "blue");
      $td.css("width", "96.5%");

      $c1.attr("src", "img/_768x576/1.jpg?"+d.getTime());
      $c2.attr("src", "img/_768x576/2.jpg?"+d.getTime());
      $c3.attr("src", "img/_768x576/3.jpg?"+d.getTime());
      $c4.attr("src", "img/_768x576/4.jpg?"+d.getTime());
    }

    if (window.matchMedia("(min-width: 1200px)").matches) {
      $td.html("lg, viewport greater than 1200px.");
      $td.attr("class", "purple");
      $td.css("width", "97.5%");

      $c1.attr("src", "img/_1024x768/1.jpg?"+d.getTime());
      $c2.attr("src", "img/_1024x768/2.jpg?"+d.getTime());
      $c3.attr("src", "img/_1024x768/3.jpg?"+d.getTime());
      $c4.attr("src", "img/_1024x768/4.jpg?"+d.getTime());
    }

  }

/* After document is ready, adjust the size of the
carousel images to adjust image to fit the viewport size. */
  viewportChange();

  $(window).resize(function(){
    viewportChange();
  });

/* Web Site Navigation Item Styling  */
  $("ul li").on("click", function(){
    //remove active class from all li elements
    $("ul li").removeClass();
    //add active class to selected li element
    $(this).addClass("active")
  });

  //select elements with data-toggle=tooltip and apply the tooltip method.
  $('[data-toggle="tooltip"]').tooltip();


  $(".carousel").carousel({
      interval:4000,
      pause:true,
      wrap:true,
      keyboard:true
  });


}); //$(document).ready(){}
