//document.addEventListener("deviceready", init, false);
var mp3XML;
var songSelected;
var playing = false;
var paused = false;

window.onload = function()
{
    var player = document.getElementById('audioPlayer');
    //Make Buttons Work
    $('#btnPlay').on('click', function(){
        play();
    });
    
    $('#btnPause').on('click', function(){
        player.pause();
        playing = false;
        paused = true;
    });
    
    $('#btnStop').on('click', function(){
        player.pause();
        player.currentTime = 0;
        playing = false;
        songSelected = null;
        $('#songTitle').html('');
        $('#songArtist').html('');
        $('#songTime').html('00:00');
    });
    
    //Get the Interesting Music from Free Music Archive
    $.ajax({
        url: "https://freemusicarchive.org/interesting.atom",
        dataType: "xml",
      }).done(function(content){
        mp3XML = content;
        var $entries = $(mp3XML).find('entry');
        var out = "<ul id='songlist'>";
        $.each($entries, function(index, value){
            out += "<li id='" + index + "'><a href='#'>";
            out += value.getElementsByTagName('title')[0].firstChild.nodeValue;
            out += "</a></li>";
        })
        out += "</ul>";    
        buildOutput(out);
              
              
              }).fail(function(e){
              alert("Communication Error");
              console.log(e);
              });
}

function buildOutput(out)
{
    $('#songs').html(out);
    $('#songlist').listview();
    $('#songlist').on('click', 'li', function(){
        playing = false;
        songSelected = $(this).context.id; 
        play();
    });
}

function play()
{
    var player = document.getElementById('audioPlayer');
    if(songSelected != null){
        if(!playing){
            if(!paused){
                player.pause();
                var songXML = $(mp3XML).find('entry')[songSelected];
                var songURL = songXML.getElementsByTagName('link')[1].getAttribute('href');
                player.src = songURL;
                player.play();
                playing = true;
                populateInfo();
            } else
            {
                player.play();
                paused = false;
                playing = true;
            }
        }
    update = setInterval(update, 100);
    
    }
    
}

function update()
{
    var time = document.getElementById('audioPlayer').currentTime;
    var songLength = document.getElementById('audioPlayer').duration;
    time= secsToTime(time);
    songLength = secsToTime(songLength);
    out = time +" / " + songLength;
    $('#songTime').html(out);
}

function populateInfo()
{
    var songXML = $(mp3XML).find('entry')[songSelected];
    console.log(songXML);
    var title = songXML.getElementsByTagName('title')[0].firstChild.nodeValue;
    var author= songXML.getElementsByTagName('author')[0];
    author = author.getElementsByTagName('name')[0].firstChild.nodeValue;
    $('#songTitle').html(title);
    $('#songArtist').html(author);
    
}

function secsToTime(totalSeconds) {
  var hours   = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  var seconds = Math.floor(totalSeconds - (hours * 3600) - (minutes * 60));

  // round seconds
  seconds = Math.round(seconds * 100) / 100

  var result =  (minutes < 10 ? "0" + minutes : minutes);
      result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
  return result;
}

