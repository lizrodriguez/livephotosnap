'use strict';
$(document).ready(function() {

     $('#uploadForm').submit(function() {
        $("#status").empty().text("File is uploading...");
        $(this).ajaxSubmit({
            error: function(xhr) {
          status('Error: ' + xhr.status);
            },
            success: function(response) {
        console.log(response)
            $("#status").empty().text(response);
            }
    });
    return false;
    });


const myNewPlayer = LivePhotosKit.Player();
document.body.appendChild(myNewPlayer);

LivePhotosKit.Player(document.getElementById('LivePhoto'));

window.onload=function() {
  var img = document.getElementById("img");
    EXIF.getData(img, function() {
        var allMetaData = EXIF.getAllTags(this);

        var GPSLatitude = EXIF.getTag(this, "GPSLatitude");

        var GPSLongitude = EXIF.getTag(this, "GPSLongitude");
          console.log(allMetaData);

        var GPSLatitudeConverted = GPSLatitude[0].numerator + GPSLatitude[1].numerator /
           (60 * GPSLatitude[1].denominator) + GPSLatitude[2].numerator / (3600 * GPSLatitude[2].denominator);

        var GPSLongitudeConverted = GPSLongitude[0].numerator + GPSLongitude[1].numerator /
           (60 * GPSLongitude[1].denominator) + GPSLongitude[2].numerator / (3600 * GPSLongitude[2].denominator);


        console.log("Latitude is: " + GPSLatitudeConverted);
        console.log("Longitude is: " + GPSLongitudeConverted);

        var map = document.getElementById("map");
        map.innerHTML ="<img src='https://maps.googleapis.com/maps/api/staticmap?center=" + GPSLatitudeConverted + ",-" + GPSLongitudeConverted + "&zoom=12&size=600x400&maptype=roadmap&markers=color:red%7Clabel:%7C" + GPSLatitudeConverted + ",-" + GPSLongitudeConverted + "&key=AIzaSyCrKjo4E_YfucBPbXszsDj4nhLyfffzWm4'>";

        var make = EXIF.getTag(this, "Make");
        var model = EXIF.getTag(this, "Model");
        var makeAndModel = document.getElementById("makeAndModel");
        makeAndModel.innerText = make + " " + model;

    });
 };


});
