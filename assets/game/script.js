var canvas = $('#canvas')[0];
            var draw = canvas.getContext('2d');
            var w = canvas.width;
            var h = canvas.height;
            var cellWidth = 10;
            var direction;
            var snake = [];
            var food =[];
            var rock=[];
            var score={
                value:0,
                increment:function(){
                    score.value+=100;
                },
                draw:function(){
                    draw.fillStyle="white";
                     draw.fillText('score : '+ score.value.toString() , 5, 15);
                },
                life:function(){
                    score.value+=Math.round(Math.random()*250);
                }
                

            }
            var speed = 0;
            var endText =[];
            var fbs={
                value:60,
                change:function(){
                    fbs.value =Math.round((Math.random()*89)+1);
                    if (fbs.value < 30) fbs.value = 60;
                    speed= setInterval(paint,60);
                    clearInterval(game_fbs);
                    game_fbs= setInterval(paint,fbs.value);
                    clearInterval(speed);
                    speed=0;
                },
                draw:function(){
                    draw.fillStyle="white";
                    draw.fillText('fbs : '+ fbs.value.toString() , w -50 , 15);
                }
            };
            draw.fillStyle = "white"
            draw.strokeStyle = "#dc322f"
            draw.strokeRect(0, 0, w, h);
            draw.fillRect(0, 0, w, h);
            draw.fillStyle = "#dc322f";
          
            //draw.fillText('psd',4,h-2,100);
            function init() {
            endText.push({x:0,y:5},{x:10,y:2})
            direction = 'right';
            createSnake();
            createFood();
            createRock();
            rock.set();
            rock.paint();
            paint();
            
            }
            init();
           
            function createSnake() {
                var length = 10;
                for ( var i = length -1 ; i>= 0; i--)
                {
                    snake.push({x:i+1,y:1});
                }

            }
           
            
            function createFood() {
                food = {
                    x: Math.round(Math.random() * ((w - cellWidth) / cellWidth)),
                    y: Math.round(Math.random() * ((h - cellWidth) / cellWidth)),
                    color:'#dc322f',
                    paint : function(){
                    
                    /*if ( this.color =="#dc322f" )
                        this.color = "#a11a17";
                    else
                        this.color = "#dc322f"; */
                    draw.fillStyle=this.color;
                    draw.fillRect(food.x * cellWidth, food.y * cellWidth, cellWidth, cellWidth);
                    draw.strokeStyle="#2A3038";
                    draw.strokeRect(food.x * cellWidth,food.y * cellWidth, cellWidth, cellWidth);},
                    rnew:function(){
                        score.increment();
                    food.x= Math.round(Math.random() * ((w - cellWidth) / cellWidth));
                    food.y= Math.round(Math.random() * ((h - cellWidth) / cellWidth));
                    }


                }
            }
            function createRock(){
            rock={
                 NumberOfRocks: Math.round(Math.random()*9),
                 item:[],
                 set:function ()
                 {
                    for (var i=0 ;i<=this.NumberOfRocks-1;i++)
                    
                     this.item.push({x:Math.round(Math.random() * ((w - cellWidth) / cellWidth)),y:Math.round(Math.random() * ((h - cellWidth) / cellWidth))})
                    
                 },
                 paint: function(){
                                for(var i=0;i<=this.item.length-1; i++ )
                                        {
                                        draw.fillStyle = "lightgray";  
                                        draw.fillRect(this.item[i].x * cellWidth, this.item[i].y  * cellWidth, cellWidth, cellWidth);
                                        draw.strokeStyle="#2A3038";
                                        draw.strokeRect(this.item[i].x * cellWidth, this.item[i].y * cellWidth, cellWidth, cellWidth);
                                        } // for
                                        }   //func                          
                } // obj
            } // create rocks
            
            function paint() {
                draw.fillStyle = "#2A3038"
                draw.strokeStyle = "#dc322f"
                draw.fillRect(0, 0, w, h);
                draw.strokeRect(0, 0, w, h);
                draw.font="10pt tahoma"

                // cell head position
                var hx = snake[0].x;
                var hy = snake[0].y;
                
                var snakeTall
             
                if (hx == food.x && hy == food.y)
                {
                snakeTall = {x:hx,y:hy};
                food.rnew();
                
                }
                else
                {
                
                snakeTall = snake.pop(); // last cell { last object}
                }
                food.paint();
                if (direction == 'right') { hx++;  }
                else if (direction == 'left') { hx--;  }
                else if (direction == 'up') { hy--;  }
                else if (direction == 'down') { hy++; }
                $("#x").text('x: ' + hx.toString());
                $("#y").text('y: ' + hy.toString());
                if (hx < 0) { hx = (w/10)-1 }
                else if (hx > (w/10)-1) { hx = 0 }
                if (hy < 0) { hy = (h/10)-1 }
                else if (hy > (h/10)-1) { hy = 0 }
                snakeTall.x = hx;
                snakeTall.y = hy;
                snake.unshift(snakeTall);
                if (checkCollision(hx,hy,1,snake) == true || checkCollision(hx,hy,0,rock.item ) == true ){
                gameOver();
                $(document).off("keydown");
                }
                rock.paint();
                // draw the snake every movement 
                for (var i = 0; i < snake.length; i++) {
                    if (i == 0) { draw.fillStyle = "white"; } else { draw.fillStyle = "#dc322f";  }
                    draw.fillRect(snake[i].x * cellWidth, snake[i].y * cellWidth, cellWidth, cellWidth);
                    draw.strokeStyle="#2A3038";
                    draw.strokeRect(snake[i].x * cellWidth, snake[i].y * cellWidth, cellWidth, cellWidth);
                }
                
               score.draw();
               //fbs.draw();
               document.title= 'Snake Game , score : ' + score.value.toString()+ ' , fbs : ' + fbs.value.toString();
            
            } // paint
            
            var x, y,o; // g= game o = over o= operation
                x=0;
                y=0;
                function gameOver(){
                clearInterval(game_fbs);
                clearInterval(fbsId); 
                clearInterval(score_life_value);   
                o=setInterval(goPaint,1);       
                }
                function goPaint(){
                draw.fillStyle = "#dc322f";    
                draw.fillRect(x,y,10,10);
                draw.strokeRect(x,y,10,10);
                if ( y == h)
                {
                clearInterval(o);
                }
                else if (x < w)
                 x+=10
                else if (x == w)
                 {
                 x=0;
                 y+=10;
                 }
                }
            function checkCollision(x , y ,start, base){
             for( var i =start;i<= base.length -1 ; i++)
             {
              if ( x == base[i].x && y == base[i].y) return true
             }
             return false
            }
            
            function fill(){
            var i=0;
            var j=0;
            draw.fillStyle = "#dc322f"
                draw.strokeStyle = "#2A3038"
            for(i=0; i<=400;i=i+10)
                    {
                    for(j=0; j<=400;j=j+10)
                     {
                     draw.fillRect(i,j,10,10);
                     draw.strokeRect(i,j,10,10);
                     }                   
                    }           
            
            }
            $(document).on("keydown", function (e) {
                //console.log(e.which);
                // up   38 -> y--
                //down  40 -> y++
                //left  37 -> x--
                //right 39 -> x++
                if (e.which == 38 && direction != 'down') direction = 'up';
                else if (e.which == 40 && direction != 'up') direction = 'down'
                else if (e.which == 37 && direction != 'right') direction = 'left'
                else if (e.which == 39 && direction != 'left') direction = 'right';
                else return;
                //if  ([37, 38, 39, 40].indexOf(e.which) != -1) 
            });

            var game_fbs = setInterval(paint,fbs.value);
            fbsId = setInterval(fbs.change,5000);
            var score_life_value = setInterval(score.life,5000);
