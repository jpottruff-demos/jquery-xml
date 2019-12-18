$(document).ready(function() {

  //FIXME
  //PAGE 2 ONLY LOADS AFTER IT HAS BEEN NAIVAGATED TO ONCE - cannot figure this out
  // footer - get student number and program from student name attribbute (broken and commented out)

  //NOTE: Super buggy in chrome - works in fire fox?? find out how to fix
  
  loadMain();
  //since we are dynamically creating buttons, must use a delegated event - need hook to static parent
  //see: https://stackoverflow.com/questions/6658752/click-event-doesnt-work-on-dynamically-generated-elements
  $('#movieBlock1').on("click", isMovieBtn);
  $('#movieBlock2').on("click", isMovieBtn);
  $('#movieBlock3').on("click", isMovieBtn);


/**FUNCTIONS**/
  function loadMain(){
    /*MAIN PAGE SET UP*/
    $.ajax({
      url: 'site.xml',
      data:{},
      type:'POST',
      dataType: 'xml',
      success(data){
        /*POPULATE HEADER*/
        let siteTitle = $(data).find('siteTitle').text();

        $('#mainHeader').append(siteTitle);
        $('#movieHeader').append(siteTitle);

        /*POPULATE FOOTER*/
        let student = $(data).find('studentName').text();
        //FIXME - both throwing erros
        // let studentNumber = student.getAttribute('studentNumber');
        //let program = student.attr('program');

      $('#mainFooter').append(student);
      $('#movieFooter').append(student);

        /*POPULATE MOVIES*/
        let movies = $(data).find('movie');

        //dynamic creation of movie buttons based on movies in XML
        $.each(movies, function(i, movie) {
          //variables
          let blockToPlace;
          //will work with if grid is in THIRDS - modify if not
          switch ((i + 1) % 3) {
            case 0:
              blockToPlace = '#movieBlock3';
              break;
            case 1:
              blockToPlace = '#movieBlock1';
              break;
            case 2:
              blockToPlace = '#movieBlock2';
              break;
          }
          let buttonLink = $('<a>');
          let movieBtnId = 'movie' + (i + 1);
          let movieTitle = $(movie).find('title').text();
          //create button based on variables
          buttonLink.attr('href', '#page2');
          buttonLink.attr('class','ui-btn movie-btn');
          buttonLink.attr('id', movieBtnId);
          buttonLink.attr('data-transition', 'flow');
          buttonLink.text(movieTitle)
          //put it in the right block of the grid
          $(blockToPlace).append(buttonLink);


        });
      } // end success
    });//end ajax
}//endloadmain

  function isMovieBtn(event) {
    //get the class list and check it for movie-btn
    let classes = event.target.classList;
    $.each(classes, function(i, c) {
      if (c == "movie-btn") {
        clearOldInfo();

        getMovieInfo(event.target.innerHTML);
      }
    });
  }

  function clearOldInfo() {
    $('#movieTitle').empty();
    $('#moviePoster').empty();
    $('#moviePlot').empty();
    $('#castList').empty();
    $('#movieReviews').empty();
    //closes any previously opened menus
    $('[data-role="collapsible"]').collapsible('collapse');
  }

  function getMovieInfo(m) {
    $.ajax({
      url: 'site.xml',
      data:{},
      type:'POST',
      dataType: 'xml',
      success(data){
        let selectedMovie = $(data).find('title:contains("' + m + '")').parent();

        let title = selectedMovie.find('title');

        //FIXME - NOT WORKING - returning object not plain text
        let image = selectedMovie.attr('image');

        let plot = selectedMovie.find('plot').text();
        let castList = selectedMovie.find('actor');
        let reviews = selectedMovie.find('review');
        let links = selectedMovie.find('link');

        //set content
        $('#movieTitle').append(title);
        let img = $('<img>');
        img.attr('src', image);
        img.attr('alt', title);
        img.appendTo('#moviePoster');
        $('#moviePlot').append(plot);
        $('#movieTitle').append(title);
        $.each(castList, function(i, actor) {
          let listItem = $('<li>');
          listItem.text(actor.innerHTML);
          $('#castList').append(listItem);
        });
        $.each(reviews, function(i, review) {
          let reviewDiv = $('<div>');
          reviewDiv.attr('data-role', 'collapsible');
          let reviewHeading = $('<h5>');
          reviewHeading.text('Review ' + (i + 1));
          let reviewContent = $('<p>');
          reviewContent.text(review.innerHTML);

          reviewDiv.append(reviewHeading, reviewContent);
          $('#movieReviews').append(reviewDiv).collapsibleset('refresh');
        });
        $.each(links, function(i, link) {
          let source = link.getAttribute('source');
          if (source == "imdb") {
            $('#imdbLink').attr('href', link.innerHTML);
          } else if (source == "rottenTomatoes") {
            $('#rottenTomatoesLink').attr('href', link.innerHTML)
          } else {
            console.log("dont have a link button for" + source);
            console.log(link.innerHTML);
          }
        });
      }
    });
  }//end getmovie info

});
