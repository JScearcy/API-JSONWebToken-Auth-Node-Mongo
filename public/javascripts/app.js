var $loginForm;
var $testDiv;
var $registerForm;
var $user;
var $error;
var $content;
var $logout;
var $postForm;
var $posts;

$(document).ready(function () {

    $loginForm = $('#login');
    $testDiv = $('#test');
    $registerForm = $('#register');
    $error = $('#error');
    $content = $('#content');
    $logout = $('#logout');
    $user = $('#user');
    $postForm = $('#postEvent');
    $posts = $('.posts');
    $content.hide();
    setupAjax();

    bindEvents();

    showUser();
});

function showUser() {
    if (localStorage.getItem('userProfile')) {
        var user = JSON.parse(localStorage.getItem('userProfile'));
        $loginForm.hide();
        $content.show();
        $user.text('You are currently logged in as ' + user.username);
        $.ajax({
          method: 'get',
          url: '/api/oldposts'
        }).done(function(res){
          var source   = $("#post-template").html();
          var template = Handlebars.compile(source);
          $posts.append(template(res));
          setupAjax();
        }).fail(function(err){
          console.log(err);
        }).always(function(data){
        })
    }
}

function hideUser() {
    if (localStorage.getItem('userToken')) {
        localStorage.removeItem('userToken');
    }

    if (localStorage.getItem('userProfile')) {
        localStorage.removeItem('userProfile');
    }
    $loginForm.show();
    $user.text('');
    $content.hide();
}

function setupAjax() {
    $.ajaxSetup({
        'beforeSend': function (xhr) {
            if (localStorage.getItem('userToken')) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + localStorage.getItem('userToken'));
            }
        }
    });
}

function bindEvents() {

    // set up the API test
    $testDiv.on('click', function (e) {
      var data = ''
        $.ajax('/api/test', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            // on a success, put the secret into content area
            //$content.text(data);

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // on a failure, put that in the content area
            // $content.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    // set up login
    $loginForm.on('submit', function (e) {
        // stop the form from submitting, since we're using ajax
        e.preventDefault();

        // get the data from the inputs
        var data = $(this).serializeArray();

        // go authenticate
        $.ajax('/authenticate', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            // Save the JWT token
            localStorage.setItem('userToken', data.token);
            // Set the user
            localStorage.setItem('userProfile', JSON.stringify(data.user));

            // clear form
            $loginForm[0].reset();

            showUser();
            $content.show();
            setupAjax();

        }).fail(function (jqXHR, textStatus, errorThrown) {
            $error.text(jqXHR.responseText);
        }).always(function () {
            console.log("complete");
        });
    });

    $postForm.on('submit', function(e){
      e.preventDefault();
      var rawdata = $(this).serializeArray();
      var data = {
        title: rawdata[0].value,
        description: rawdata[1].value,
        location: rawdata[2].value,
        date: rawdata[3].value,
        time: rawdata[4].value
      }
      $postForm.trigger("reset");
      $.ajax({
        method: 'post',
        url: '/api/newpost',
        data: data
      }).done(function(res){
        var source   = $("#post-template").html();
        var template = Handlebars.compile(source);
        $posts.append(template(res));
      })
    })

    // set up register
    $registerForm.on('submit', function (e) {
        // stop the form from submitting, since we're using ajax
        e.preventDefault();

        // get the data from the inputs
        var data = $(this).serializeArray();

        // go authenticate
        $.ajax('/register', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            //redirect back home, so that they can log in
            window.location.replace('/');

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // show the user the error
            $error.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    $logout.on('click', function () {
        hideUser();
    })
}
