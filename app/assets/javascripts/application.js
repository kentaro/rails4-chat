// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(function () {
    var result = $('#result');
    var notice = function (message) {
        result.prepend('<li class="notice">' + message + '</li>');
    };
    var error  = function (message) {
        result.prepend('<li class="error">' + message + '</li>');
    };
    var line   = function (message) {
        result.prepend('<li>' + message + '</li>');
    };

    var source = new EventSource('/stream');

    source.addEventListener('open', function(event) {
        notice("Connected to server...");
    }, false);

    source.addEventListener('message', function(event) {
        line(event.data);
    }, false);

    // On closed explicitely by close event
    source.addEventListener('close', function(event) {
        source.close();
        notice("Server emitted close event.");
    }, false);

    $(window).unload(function () {
        source.close();
    });

    // On server closed connection
    source.addEventListener('error', function(event) {
        source.close();
        notice("Connection closed.");
    }, false);

    $('#post-button').click(function () {
        $.ajax({
            type: 'POST',
            url:  '/post',
            data: { 'message' : $('#message').val() }
        }).done(function (res)   {
        }).fail(function (error) {
            error('Failed to connect server: ' + error.message);
        });
    });
});
