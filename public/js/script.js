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


// A Player built from a new DIV:
const myNewPlayer = LivePhotosKit.Player();
document.body.appendChild(myNewPlayer);
// A Player built from a pre-existing element:
LivePhotosKit.Player(document.getElementById('LivePhoto'));




});
