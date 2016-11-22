var readyFunction = function() {
	var socket = io();

	$(document).ready(function() {
		var searchString = ''
		socket.emit('pageLoad', searchString)
		return false;
	})

	socket.on('load', function(player, playing, trackInfo) {
		var player = player;
		var isPlaying = playing;
		var currentDocTitle = trackInfo.trackName.toUpperCase() + ' // ' + trackInfo.artist.toUpperCase();
		document.title = currentDocTitle;
		console.log(currentDocTitle)
		var trackInfo = '<li class="info--item track">'
										+ trackInfo.trackName + '</li>' +
											'<li class="info--item artist">'
										+   trackInfo.artist + '</li>' +
											'<li class="info--item album">'
										+   trackInfo.album + '</li>'


		if (isPlaying === true) {
			$('.music__box').append('<div class="music__box--status"><h1><span>TJ</span> IS CURRENTLY LISTENING TO:</h1></div>')
		} else {
			$('.music__box--equalizer').hide();
			$('.music__box').append('<div class="music__box--status"><h1><span>TJ</span> LAST LISTENED TO:</h1></div>')
		}
		$('.music__box--info').append(trackInfo)


		$('.music__box--player').append(player)
	})

	$('.music__box').click(function() {
		$('.music__box--player > iframe').toggleClass('hide')
		$('.music__box--info').toggleClass('flip')
	})

	var bars = document.querySelectorAll('.bar')

	setInterval(function() {
		for (var i = 0; i < bars.length; i++) {
		bars[i].style.height = Math.floor((Math.random() * 20) + 1) + "px";
		}
	}, 120);
}

if (document.readyState != 'loading') {
	readyFunction();
}
else {
	document.addEventListener('DOMContentLoaded', readyFunction)
}