var $loginForm;
var $testDiv;
var $registerForm;
var $userDiv;
var $error;
var $content;

$(document).ready(function () {

    $loginForm = $('#login');
    $testDiv = $('#test');
    $registerForm = $('#register');
    $userDiv = $('#user');
    $error = $('#error');
    $content = $('#content');

    setupAjax();

    bindEvents();

    showUser();
});

function showUser() {
    if (localStorage.getItem('userProfile')) {
        var user = JSON.parse(localStorage.getItem('userProfile'));
        console.log(user);
        $loginForm.remove();
        $userDiv.text('You are currently logged in as ' + user.username);
    }
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
        $.ajax('/api/test', {
            method: 'get'
        }).done(function (data, textStatus, jqXHR) {

            // on a success, put the secret into content area
            $content.text(data);
            console.log("success");

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);

            // on a failure, put that in the content area
            $content.text(jqXHR.responseText);
            console.log("error");
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
            console.log("success", data);
            // Save the JWT token
            localStorage.setItem('userToken', data.token);
            // Set the user
            localStorage.setItem('userProfile', JSON.stringify(data.user));
            showUser();
            setupAjax();

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            $error.text(jqXHR.responseText);
        }).always(function () {
            console.log("complete");
        });
    });

    // set up login
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
            console.log(data);
            console.log("success");

            //redirect back home, so that they can log in
            window.location.replace('/');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            $error.text(jqXHR.responseText);
        }).always(function () {
            console.log("complete");
        });
    })
}