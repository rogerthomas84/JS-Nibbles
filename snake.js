var dir = "right";
var lastDir = "right";
var boardWidth = 0;
var boardHeight = 0;
var speed = 100;
var level = 1;

var isPaused = false;
var isStopped = false;
var isRunning = true;

$(document).ready(function(){
	$('.board').height(500);
	$('.board').width(960);
	setTimeout(function(){
	    assignDefaults();
	    startAction();
	},100)
});
$(document).keydown(function(e){
	registerKeypress(e);
});



function registerKeypress(e) {
	var keyCode = e.keyCode || e.which, btn = {refresh: 116, left: 37, up: 38, right: 39, down: 40, space: 32, escape: 27, enter: 13 };
    switch (keyCode) {
	    case btn.refresh:
	        //e.preventDefault();
	    	//return false;
	        break;
	    case btn.left:
            if (dir != "right" && !isPaused && !isStopped) {
                setTimeout(function(){
                    lastDir = dir;
                    dir = "left";
                },(speed));
                //move();
            }
	        break;
        case btn.right:
            if (dir != "left" && !isPaused && !isStopped) {
                setTimeout(function(){
                    lastDir = dir;
                    dir = "right";
                },(speed));
                //move();
            }
            break;
        case btn.up:
            if (dir != "down" && !isPaused && !isStopped) {
            	setTimeout(function(){
            	    lastDir = dir;
            	    dir = "up";
            	},(speed));
                //move();
            }
            break;
        case btn.down:
        	if (dir != "up" && !isPaused && !isStopped) {
                setTimeout(function(){
                    lastDir = dir;
                    dir = "down";
                },(speed));
                //move();
        	}
            break;
        case btn.space:
            pause();
            break;
        case btn.escape:
            pause();
            break;
        case btn.enter:
            pause();
            break;
    }
}
function restart() {
	assignDefaults();
	startAction();
}

function assignDefaults() {
	$('.block').remove();
	$('.fruit').remove();
	dir = "right";
    lastDir = "right";
    boardWidth = 0;
    boardHeight = 0;
    speed = 100;
    boardHeight = $('.board').height();
    boardWidth = $('.board').width();
    $('.speed').text(speed);
    $('.points').text(0);
    $('.level').text(1);
    isPaused = true;
    var name=prompt("Please enter your name","");
    if (name!=null && name!="") {
    	$('.myname').text(name);
    } else {
    	$('.myname').text("Sammy");
    }
    $('.board').append('<div class="paused">Press \'Return\' to start</div>');
    flashPaused();
}

function stop() {
    if (!isStopped) {
    	isStopped = true;
    }
    isRunning = false;
}
function flashPaused() {
	if (!isPaused) {
		return false;
	}
	if ($('.paused').length > 0) {
		$('.paused').fadeOut('fast',function(){
			$('.paused').fadeIn('fast',function(){
				flashPaused();
			});
		});
	}
	return false;
}

function pause() {
	if (isRunning) {
		if (isPaused) {
			$('.paused').remove();
			isPaused = false;
		} else {
			if ($('.paused').length == 0) {
				$('.board').append('<div class="paused">Paused<br />Press \'Return\' to continue</div>');
			}
			setTimeout(function(){
				flashPaused();
			},200);
			isPaused = true;
		}
	}
}

function startAction() {
	var i = 0;
	var xTop = 200;
	var xLeft = 200;
	while (i < 10) {
		i++;
		xLeft = xLeft - 10;
		$('.board').append('<div class="block" style="top:' + xTop + 'px;left:' + xLeft + 'px;"></div>');
	}
	move();
}

function move() {
	
	if (isStopped) {
		return false;
	}
	
	if (isPaused) {
		return setTimeout(function(){
			move();
		},100);
	}
	
	var pos = $('.block').first().position();
    var posLeft = pos.left;
    var posTop = pos.top;
	$('.block').last().css({}).insertBefore($('.block').first());
	
	var colPos = $('.block').first().next().position();
	
    if (dir == "right") {
        posLeft = posLeft + 10;
        $('.block').first().css({left:posLeft,top:posTop});
    }
    else if (dir == "left") {
        posLeft = posLeft - 10;
        $('.block').first().css({left:posLeft,top:posTop});
    }
    else if (dir == "up") {
        posTop = posTop - 10;
        $('.block').first().css({left:posLeft,top:posTop});
    }
    else if (dir == "down") {
        posTop = posTop + 10;
        $('.block').first().css({left:posLeft,top:posTop});
    }
    

    evaluateFruit();
    evaluateCrash();
    
	setTimeout(function(){
		return move();
	},speed);
}

function evaluateCrash() {
	
	var bPos = $('.block').first().position();
	
	/**
	 * Did Sammy hit the side of the board?
	 */
	if (bPos.left < 0 || (bPos.left + 10) > boardWidth || bPos.top < 0 || (bPos.top + 10) > boardHeight) {
		stop();
		pause();
		$('.block').first().remove();
		var t = confirm('You died! Try again?');
		if (t) {
			// return restart();
			window.location.href = window.location;
		}
	}
	
	/**
	 * Did sammy hit himself?
	 */
	$('.block').each(function(i,v){
		if (i != 0) {
			var tP = $(this).position();
			if (tP.top == bPos.top && tP.left == bPos.left) {
		        stop();
		        pause();
		        $('.block').first().remove();
		        var t = confirm('You crashed into yourself! Try again?');
		        if (t) {
		            // return restart();
		            window.location.href = window.location;
		        }
			}
		}
	});
	return;
	
}

function evaluateFruit() {
	
	if (!$('.fruit').length) {
		var MaxY = boardHeight;
        MaxY = parseInt((MaxY - 10));
        var MaxX = boardWidth;
        MaxX = parseInt((MaxX - 10));
        var randomX = Math.round(Math.floor(Math.random() * (MaxX - 0 + 1)) / 10) * 10;
        var randomY = Math.round(Math.floor(Math.random() * (MaxY - 0 + 1)) / 10) * 10;
        $('.board').append('<div class="fruit" style="top:' + randomY + 'px;left:' + randomX + 'px;" />');
	} else {
		var fPos = $('.fruit').position();
		var fL = fPos.left;
		var fT = fPos.top;
        var fR = fL + 10;
        var fB = fT + 10;
        var bPos = $('.block').first().position();
        var bL = bPos.left;
        var bR = bL + 10;
        var bT = bPos.top;
        var bB = bT + 10;
        if ( (fL == bL) && (fR == bR) && (fB == bB) && (fT == bT) ) {
        	$('.fruit').remove();
        	// add block
        	var pLast = $('.block').last().position();
        	var pPrev = $('.block').last().prev().position();
        	var numElementsToGrow = 4;
        	
        	
            if (dir == "right") {
            	var gi = 0;
            	while (gi < numElementsToGrow) {
            		gi++;
            		$('.board').append('<div class="block" style="top:' + (pLast.top) + 'px;left:' + (pLast.left - 10) + 'px;"></div>');
            	}
            	
            }
            else if (dir == "left") {
            	var gi = 0;
            	while (gi < numElementsToGrow) {
            		gi++;
            		$('.board').append('<div class="block" style="top:' + (pLast.top) + 'px;left:' + (pLast.left + 10) + 'px;"></div>');
            	}
            }
            else if (dir == "up") {
            	var gi = 0;
            	while (gi < numElementsToGrow) {
            		gi++;
            		$('.board').append('<div class="block" style="top:' + (pLast.top + 10) + 'px;left:' + (pLast.left) + 'px;"></div>');
            	}
            }
            else if (dir == "down") {
            	var gi = 0;
            	while (gi < numElementsToGrow) {
            		gi++;
            		$('.board').append('<div class="block" style="top:' + (pLast.top - 10) + 'px;left:' + (pLast.left) + 'px;"></div>');
            	}
            	
            }
        	var c = $('.points').text();
        	$('.points').text(parseInt(c) + 1);
        	if ((parseInt(c) + 1) % 5 === 0) {
        		speed = speed - 5;
        		$('.speed').text(speed);
        	}
        	
        	var l = $('.level').text();
        	if ((parseInt(c) + 1) % 10 === 0) {
        		// new Level
        		$('.level').text(parseInt(l) + 1);
        	}
        }
	}
	
}