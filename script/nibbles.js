var JsNibbles = function() {

    var apples = 5;
    var skipMoves = 0;
    var apple = null;
    var appleSkip = 0;
    var moveSize = 10;
    var speed = 100;
    var dir = "right";
    var isPaused = false;
    var isRunning = false;
    var boardHeight = 0;
    var boardWidth = 0;
    var levelBlocks = new Array();
    var level = 1;
    var startAt = {};
    var soundEaten = document.createElement('audio');
    soundEaten.setAttribute('src', 'sounds/eat.mp3');
    var soundDead = document.createElement('audio');
    soundDead.setAttribute('src', 'sounds/dead.mp3');
    
    this.preStart = function() {
        boardWidth = $('.board').width();
        boardHeight = $('.board').height();
        // TODO: This needs to setup the game.
        start();
    };
    
    var reset = function() {
        apples = 5;
        skipMoves = 0;
        apple = null;
        appleSkip = 0;
        moveSize = 10;
        speed = 100;
        dir = "right";
        isPaused = false;
        isRunning = false;
        boardHeight = 0;
        boardWidth = 0;
        levelBlocks = new Array();
        level = 1;
        startAt = {};
    };

    var start = function() {
        setupLevel(level);
        promptToStart();
    };
    
    var promptToStart = function() {
        keyListener();
        var name=prompt("Please enter your name","");
        if (name!=null && name!="") {
            $('.myname').text(name);
        } else {
            $('.myname').text("Sammy");
        }
        dir = "right";
        isPaused = true;
        isRunning = true;
        move();
        givePaused();
        flashPaused();
        return;
    };
    
    var givePaused = function() {
        $('.board').append('<div class="paused">Press \'Return\' to start</div>');
    };
    
    var flashPaused = function() {
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
    };
    
    var pause = function() {
        if (isRunning) {
            if (isPaused) {
                $('.paused').remove();
                isPaused = false;
                isRunning = true;
            } else {
                if ($('.paused').length == 0) {
                    givePaused();
                }
                setTimeout(function(){
                    flashPaused();
                },200);
                isPaused = true;
            }
        }
    };
    
    /**
     * Set up the level obstacles and settings.
     */
    var setupLevel = function(l) {
        var lvl = l; // Emulate a level change here. 
        apple = null;
        if (lvl == 1) {
            apples = 5;
            startAt = {t:240,l:480};
            speed = 100; // Variable speed?
            levelBlocks = new Array();
        } else if (lvl == 2) {
            apples = 15;
            speed = 100; // Variable speed?
            levelBlocks = new Array();
            startAt = {t:120,l:480};
            var i = 0;
            var t = 240;
            var l = 170;
            while(i<60) {
                l = l+10;
                levelBlocks[i] = {t:t,l:l};
                i++;
            }
        } else if (lvl == 3) {
            apples = 30;
            speed = 100; // Variable speed?
            levelBlocks = new Array();
            startAt = {t:20,l:150};
            var i = 0;
            var t = 50;
            var l = 320;
            while(i<76) {
                t = t+10;
                levelBlocks[i] = {t:t,l:l};
                i++;
                levelBlocks[i] = {t:t,l:(l+320)};
                i++;
            }
        } else if (lvl == 4) {
            apples = 45;
            speed = 100; // Variable speed?
            levelBlocks = new Array();
            startAt = {t:20,l:150};
            var i = 0;
            var t = 120;
            var l = 320;
            while(i<48) {
                t = t+10;
                levelBlocks[i] = {t:t,l:l};
                i++;
                levelBlocks[i] = {t:t,l:(l+320)};
                i++;
            }
            var nI = i+50;
            var t = 100;
            var l = 350;
            while(i<(nI)) {
                l = l+10;
                levelBlocks[i] = {t:t,l:l};
                i++;
                levelBlocks[i] = {t:(t+290),l:l};
                i++;
            }
        } else {
            complete();
            return;
        }
        
        for (var i=0;i<levelBlocks.length;i++) {
            var b = levelBlocks[i];
            $('.board').append('<div class="wall" style="top:'+b.t+'px;left:'+b.l+'px;" />');
        }
        
        $('.level').text(lvl);
        level = lvl;
        var t = startAt.t;
        var l = startAt.l;
        $('.board').append('<div class="body" style="top:'+t+'px;left:'+l+'px;" />');
        var i=0;
        while(i<5) {
            l=l-moveSize;
            $('.board').append('<div class="body" style="top:'+t+'px;left:'+l+'px;" />');
            i++;
        }
    };
    
    var complete = function() {
        var c = confirm('You won! Want to play again?');
        window.location = window.location.href;
    };
    
    var move = function() {

        if (isRunning != true || isPaused != false) {
            setTimeout(function(){
                move();
            }, 100);
            return;
        }
        
        var first = $('.board .body').first();
        var pos = first.position();
        
        if (skipMoves == 0) {
            $('.body').last().css({}).insertBefore($('.body').first());
        }
        
        switch(dir){
            case("right"):
                if (skipMoves != 0) {
                    $('.body').first().before('<div class="body"></div>');
                    skipMoves--;
                }
                $('.body').first().css({
                    left : (pos.left + 10),
                    top : pos.top
                });
                break;
            case("left"):
                if (skipMoves != 0) {
                    $('.body').first().before('<div class="body"></div>');
                    skipMoves--;
                }
                $('.body').first().css({
                    left : (pos.left - 10),
                    top : pos.top
                });
                break;
            case("up"):
                if (skipMoves != 0) {
                    $('.body').first().before('<div class="body"></div>');
                    skipMoves--;
                }
                $('.body').first().css({
                    left : pos.left,
                    top : (pos.top - 10)
                });
                break;
            case("down"):
                if (skipMoves != 0) {
                    $('.body').first().before('<div class="body"></div>');
                    skipMoves--;
                }
                $('.body').first().css({
                    left : pos.left,
                    top : (pos.top + 10)
                });
                break;
        }
        ateApple();
        collision();
        setTimeout(function() {
            return move();
        }, speed);
    };
    
    var ateApple = function() {
        var first = $('.board .body').first().position();
        if (apple == null) {
            if (appleSkip > 0) {
                appleSkip--;
                return;
            }
            var MaxY = boardHeight;
            MaxY = parseInt((MaxY - 10));
            var MaxX = boardWidth;
            MaxX = parseInt((MaxX - 10));
            var randomX = Math.round(Math.floor(Math.random() * (MaxX - 0 + 1)) / 10) * 10;
            var randomY = Math.round(Math.floor(Math.random() * (MaxY - 0 + 1)) / 10) * 10;
            if (positionHitsWall({top:randomY,left:randomX}) != true) {
                apple = {t:randomY,l:randomX};
                $('.board').append('<div class="fruit" style="top:' + randomY + 'px;left:' + randomX + 'px;" />');
            } else {
                ateApple();
                return;
            }
        } else {
            var fL = apple.l;
            var fT = apple.t;
            var fR = fL + 10;
            var fB = fT + 10;
            var bL = first.left;
            var bR = bL + 10;
            var bT = first.top;
            var bB = bT + 10;
            if ( (fL == bL) && (fR == bR) && (fB == bB) && (fT == bT) ) {
                soundEaten.play();
                $('.fruit').remove();
                
                var c = $('.points').text();
                $('.points').text(parseInt(c) + 1);
                if ((parseInt(c) + 1) % 5 === 0) {
                    speed = speed - 5;
                    $('.speed').text(speed);
                }
                
                var l = $('.level').text();
                
                if ((parseInt(c) + 1) == apples) {
                    clearBoardForNewLevel(parseInt(l) + 1);
                    return;
                }
                appleSkip = 5;
                apple = null;
                skipMoves = skipMoves + (parseInt(l) * 4);
            }
            
            if ($('.fruit').is('.fruit-on')) {
                $('.fruit').removeClass('fruit-on');
            } else {
                $('.fruit').addClass('fruit-on');
            }
        }
    };
    
    var clearBoardForNewLevel = function(newLevel) {
        $('.body').remove();
        $('.wall').remove();
        dir = 'right';
        setupLevel(newLevel);
    };
    
    var collision = function() {
        var bPos = $('.board .body').first().position();
        // Side Walls
        if (bPos.left < 0 || (bPos.left + moveSize) > boardWidth || bPos.top < 0 || (bPos.top + moveSize) > boardHeight) {
            died();
            return;
        }

        // Sammy's body
        $('.board .body').each(function(i, v) {
            if (i != 0) {
                var tP = $(this).position();
                if (tP.top == bPos.top && tP.left == bPos.left) {
                    died();
                    return;
                }
            }
        });

        // Collision with level obstacles.
        if (positionHitsWall(bPos) == true) {
            died();
            return
        }
        for (var i=0;i<levelBlocks.length;i++) {
            var b = levelBlocks[i];
            if (b.t == bPos.top && b.l == bPos.left) {
                died();
                return;
            }
        }

        return;
    };
    
    var positionHitsWall = function(pos) {
        for (var i=0;i<levelBlocks.length;i++) {
            var b = levelBlocks[i];
            if (b.t == pos.top && b.l == pos.left) {
                return true;
            }
        }
        
        return false;
    };
    
    var died = function() {
        isRunning = false;
        $('.block').first().remove();
        soundDead.play();
        setTimeout(function(){
            var t = confirm('You died! Try again?');
            if (t) {
                // return restart();
                window.location.href = window.location;
            };
        }, 300);
    };

    var keyListener = function() {
        $(document).keydown(function(e) {
            if (isRunning != true) {
                return;
            }
            var keyCode = e.keyCode || e.which, btn = {refresh:116,left:37,up:38,right:39,down :40,space:32,escape:27,enter:13};
            switch (keyCode) {
                case btn.refresh:
                    break;
                case btn.left:
                    if(dir == 'right' || dir == 'left') {
                        break;
                    }
                    setTimeout(function() {
                        dir="left";
                    }, speed);
                    break;
                case btn.right:
                    if(dir == 'right' || dir == 'left') {
                        break;
                    }
                    setTimeout(function() {
                        dir="right";
                    }, speed);
                    break;
                case btn.up:
                    if(dir == 'up' || dir == 'down') {
                        break;
                    }
                    setTimeout(function() {
                        dir="up";
                    }, speed);
                    break;
                case btn.down:
                    if(dir == 'up' || dir == 'down') {
                        break;
                    }
                    setTimeout(function() {
                        dir="down";
                    }, speed);
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
        });
    };

    return this;
};