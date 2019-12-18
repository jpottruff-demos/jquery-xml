$(document).ready(function() {
    //initial state
    $('#cityInfo').hide();

    //DISPLAY PROFILE
    $('#displayInfo').click(function() {
      //could change to hide/show?
      $('#displayInfo').prop('disabled', true);

      //get info from the xml file
      $.ajax({
        url: 'userInfo.xml',
        data:{},
        type:'GET',
        dataType: 'xml',
        success(data){
          //setup variables
          let studentName = $(data).find('studentName').text();
          let studentProg = $(data).find('studentProg').text();
          let studentCampus = $(data).find('studentCampus').text();
          let images = $(data).find('image');
          let userImgSrc = images[0].innerHTML;
          let cities = $(data).find('city');

          //populate profile fields
          $('#studentName').append(studentName);
          $('#studentProgram').append(studentProg);
          $('#studentCampus').append(studentCampus);

          let img = $('<img>').attr('src', userImgSrc);
          $('#profilePicture').append(img);

          $(cities).each(function(index, obj) {
              let name = $(obj).find('name').text();
              let li = $('<li>');
              let button = $('<button>').attr( {class:'cityButton', id: name});
              $("#cityList").append( (li).append( (button).text(name) ) );
            });


          //CHANGE TO CITY VIEW
          $('.cityButton').on("click", function(e) {
            $('#cityInfo').show();
            $('#home').hide();

            //still using data extracted from xml - no need to resend request
            let selected = (e.target).id;
            let cityXML = $(data).find('name:contains("' + selected +'")').parent();
            let city = $(cityXML).find('name').text();
            let country = cityXML.find('country').text();
            let province = cityXML.find('province').text();
            let lat = cityXML.attr('lat');
            let long = cityXML.attr('long');
            let cityImgSrc = cityXML.find('image').text();

            //populate fields
            $('#selectedCity').append(city);
            $('#city').append(city);
            $('#country').append(country);
            $('#province').append(province);
            $('#lat').append(lat);
            $('#long').append(long);
            let cImg = $('<img>').attr('src', cityImgSrc);
            $('#cityPicture').append(cImg);
            });

          }
          //close success

        });
        //close ajax

      });
});
