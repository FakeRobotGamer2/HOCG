/**
 * Created by jessie on 1/8/16.
 */
var socket = io();
var muted= false;
if (!Cookies.get('username')) {
    var usernick = "Buttface McGee";
    Cookies.set('username', usernick, {'expires': 3650});
}
else { //if u hack ur cookies u can probably have colons in ur username lmao but who cares lets silicon valley this shit
    var usernick = Cookies.get('username');
}
var doublepost = new Date().getTime();
socket.emit('chat message', "Oh joy, " + usernick + " has condescended to grace us with their presence.");


function muteAudio() {
    muted = !muted;
    if (muted) {
        document.getElementById('mb').innerHTML = "Unmute Sounds";
    }
    else {
        document.getElementById('mb').innerHTML = "Mute Sounds";
    }
}

function chatemitter(msg, msgtype) {
    if (msg.indexOf(':') > -1) {

        var parsedchat = msg.split(':');
        var chattext = parsedchat.slice(1).join(':');
        var chatli = $("<div class='chat talk-bubble col-lg-7 col md-7 col-sm-8 col-xs-11 tri-right left-top'>")
        if (msgtype == "remote") {
            play_multi_sound('im');
            chatli = chatli.append($("<span class='nick'>").text(parsedchat[0] + ":"));
        }
        else if (msgtype == "stupidchild") {
            chatli = chatli.append($("<span class='stupidchild'>").text(parsedchat[0] + ":"));
        }
        else {
            chatli = chatli.append($("<span class='localnick'>").text(parsedchat[0] + ":"));
        }
        ran_num = Math.floor((Math.random() * 10000) + 1);
        chatli = chatli.append($("<span id='" + ran_num + "' class='chattext'>").text(chattext));

        $('<div></div>').appendTo('#messages').hide().append(chatli).fadeIn();
        chatli.append('</div>');
        var x = new EmbedJS({
            element: document.getElementById(String(ran_num)),
             googleAuthKey : 'AIzaSyCqFouT8h5DKAbxlrTZmjXEmNBjC69f0ts'
          });
        x.render();
    }
    else {

        if (msgtype == "local" && msg.indexOf("Oh joy,") > -1) {
        }
        else if (msgtype == "local" && msg.indexOf("Unfortunately for everyone,") > -1) {
            $('#messages').append($('<div class="sysmsg">').text("You are now " + usernick + " much to the rest of the chatroom's disappointment."));
        }
        else {
            document.getElementById('buddyin').play();
            $('#messages').append($('<div class="sysmsg">').text(msg));
        }
    }
    window.scrollTo(0, document.body.scrollHeight);
}

var channel_max = 10;										// number of channels
audiochannels = new Array();
for (a = 0; a < channel_max; a++) {									// prepare the channels
    audiochannels[a] = new Array();
    audiochannels[a]['channel'] = new Audio();						// create a new audio object
    audiochannels[a]['finished'] = -1;							// expected end time for this channel
}
function play_multi_sound(s) {
    if (muted) {
			return false;
		}
    for (a = 0; a < audiochannels.length; a++) {
        thistime = new Date();
        if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
            audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration * 1000;
            audiochannels[a]['channel'].src = document.getElementById(s).src;
            audiochannels[a]['channel'].load();
            audiochannels[a]['channel'].play();
            break;
        }
    }
}

function setSource() {
    var audio = document.getElementById('welcome');
    audio.src = "welcome.wav";
}

//all of this media playback stuff is an attempt to get sounds to play on android/chrome
//it doesnt work but i tried
function mediaPlaybackRequiresUserGesture() {
    // test if play() is ignored when not called from an input event handler
    var audio = document.createElement('audio');
    audio.play();
    return audio.paused;
}

function removeBehaviorsRestrictions() {
    var audio = document.querySelector('audio');
    audio.load();
    window.removeEventListener('keydown', removeBehaviorsRestrictions);
    window.removeEventListener('mousedown', removeBehaviorsRestrictions);
    window.removeEventListener('touchstart', removeBehaviorsRestrictions);
    setTimeout(setSource, 1000);
}

if (mediaPlaybackRequiresUserGesture()) {
    window.addEventListener('keydown', removeBehaviorsRestrictions);
    window.addEventListener('mousedown', removeBehaviorsRestrictions);
    window.addEventListener('touchstart', removeBehaviorsRestrictions);
} else {
    document.getElementById('welcome').play();
    setTimeout(function () {
        document.getElementById('gotmail').play();
    }, 2500);
}

$('form').submit(function () {
    var nowtime = new Date().getTime();
    if (nowtime - doublepost < 100) {
        return false;
    }
    doublepost = new Date().getTime();
    var mssg = $('#m').val();
    if (mssg.substring(0, 5) == "/nick") {
        if (mssg.indexOf(':') > -1) {
            socket.emit('chat message', "Everyone point and laugh at " + usernick + " for they tried to use FORBIDDEN CHARACTERS in their identifier, and failed.");
        }
        else {
            var oldnick = usernick;
            usernick = mssg.substring(6);
            socket.emit('chat message', "Unfortunately for everyone, " + oldnick + " is now known as " + usernick + ", oblivion help us all.");
            Cookies.set('username', usernick, {'expires': 3650});
        }
    }
    else {
        socket.emit('chat message', usernick + ': ' + $('#m').val());
    }
    $('#m').val('');
    return false;
});
socket.on('chat message', function (msg) {
    chatemitter(msg, "remote");
});

socket.on('local chat message', function (msg) {
    chatemitter(msg, "local");
});

chatemitter("StupiderChild: Hello there " + usernick + "! If this is not your name, change it by typing /nick then a new name. Praises and ritual in honor of our dark lady Satan are not required, but are certainly recommended.", "stupidchild")
