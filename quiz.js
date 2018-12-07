		   
		let loaded = false;
		
		function done(){
			document.getElementById("a").innerHTML="";
			document.getElementById("startButton").innerHTML = "START";
			loaded = true;
		}
		
		(function(){
			let w = window.innerWidth || 360;
			let h = window.innerHeight || 560;
		
			if(h > w){
				let nh = h;
				h = w;
				w = nh;
				document.getElementById("mainContainer").style.transform = "translateX("+(h)+"px) rotate(90deg)";
			}
			document.getElementById("mainContainer").style.width = w+"px";
			document.getElementById("mainContainer").style.height = h+"px";
			
			document.getElementById("city").style.height = h*.3+"px";
			document.getElementById("city").style.width = w+"px";
			
			let c = document.getElementById("myCanvas");
			c.height = h;
			c.width = w;
			
			let ctx = c.getContext("2d");
		
		function loadGame(){
			
			let roadWidth = 5*w/36;
			let roadTop = h-h*0.7;
			let roadLeft = (w-roadWidth)/2;
			let roadConstant = roadLeft/(h-roadTop);
			let score = 0;
			let scoreC = document.getElementById("score");
			function updateScore(ds){
				score+=ds;
				scoreC.textContent = score;
			}
			updateScore(0);
			
			let rso = [];
			let ratio = 0.8;
			let totalRso = 20;
			let maxHF = h*(1-ratio)/(2.25*(1-Math.pow(ratio,totalRso)));
			let maxH = maxHF;
			let totalHeight = 0.7*h;
			let minWidth = 1;
			let maxWidth = 26;
			let dif = maxWidth - minWidth;
			let changedHeight = totalHeight-maxH*ratio;
			let cnst1 = Math.pow(ratio,totalRso)/(1-ratio);
			let stp = h-totalHeight;
			let tMaxH = h*20/36;
			let treeCnst = tMaxH/roadLeft;
			
			let gameDifficulty = 100;
			
			
			
			function TreeBuilder(src,src2,start,left){
				this.src = treeSrc[src];
				this.src2 = treeSrc[src2];
				this.y = start;
				this.x = 0;
				this.h = 0;
				this.w = 0;
				this.dy = 0.01;
				this.r = 1.009;
				this.left = left;
			}
			
			TreeBuilder.prototype.draw = function(){
				this.y += this.dy;
				this.dy *= this.r;
				this.x = (h-this.y)*roadConstant - this.w - this.w*this.left;
				this.h = (roadLeft-this.x-this.w*this.left)*treeCnst;
				this.w = this.h*2/3;
				
				ctx.drawImage(this.src,this.x,this.y-this.h,this.w,this.h);
				ctx.drawImage(this.src2,w-this.x-this.w,this.y-this.h,this.w,this.h);
			
				if(this.y >= h){
					this.y = stp;
					this.h = 0;
					this.w = 0;
					this.left = Math.random()*3;
					this.dy = 0.5;
				}
			}
			
			function getById(x){
				return document.getElementById(x);
			}
			let treeSrc = [getById("t1"),getById("t2"),getById("t3"),getById("t4")];
			
			let trees = [];
			for(let n = 0; n < ((h*0.7)/50-2); n++){
				trees.push(new TreeBuilder(Math.floor(Math.random()*4),Math.floor(Math.random()*4),stp+n*50,2));
			}
			
			
			let carWCnst = roadLeft*2/totalHeight;
			let carW = (w > 560) ? 150 : 120;
			let carH = carW*2/3;
			
			function treeBuilder(src,start,lane){
				this.src = carSrc[src];
				this.y = start;
				this.x = 0;
				this.h = 0;
				this.w = 0;
				this.dy = 0.5;
				this.lane = lane;
			}
			
			treeBuilder.prototype.draw = function(){
				this.dy *= 1.01;
				this.y += this.dy;
				this.x = (carWCnst/2)*(h-this.y)+(w-(carWCnst*(h-this.y)))*this.lane/8;
				this.w = carW-carW*carWCnst*(h-this.y)/w;
				this.h = 1.7*this.w/3;
				
				ctx.drawImage(this.src,this.x,this.y-this.h,this.w,this.h);
				if(this.y >= h-20){
					if(Math.abs(this.x-cx) <= carH && Math.abs(this.y-h+carH) <= carH){
						clearInterval(intv);
						setTimeout(function(){
							document.getElementById("mainContainer").style.display = "none";
							document.getElementById("startPage").style.display = "block";
						},1000);
					}
				}
				if(this.y >= h+100){
					this.y = stp;
					this.h = 0;
					this.w = 0;
					this.left = Math.random()*3;
					this.dy = 0.5;
					this.lane = 1+Math.random()*5;
				}
			}
			
			let carSrc = [getById("c1"),getById("c1"),getById("c1")];
			
			let cars = [];
			for(let n = 0; n < ((h*0.7+100)/gameDifficulty); n++){
				cars.push(new treeBuilder(Math.floor(Math.random()*3),stp+n*gameDifficulty,1));
			}
			
			//Coin.....
			let coinW = (w > 560) ? 100 : 60;
			function CoinBuilder(start,lane){
				this.src = coinSrc;
				this.y = start;
				this.x = 0;
				this.h = 0;
				this.w = 0;
				this.dy = 0.5;
				this.lane = lane;
			}
			
			CoinBuilder.prototype.draw = function(){
				this.dy *= 1.01;
				this.y += this.dy;
				this.x = (carWCnst/2)*(h-this.y)+(w-(carWCnst*(h-this.y)))*this.lane/8;
				this.w = coinW-coinW*carWCnst*(h-this.y)/w;
				this.h = this.w;
				
				ctx.drawImage(this.src,this.x,this.y-this.h,this.w,this.h);
				if(this.y >= h-20){
					if(Math.abs(this.x-cx) <= coinW && Math.abs(this.y-h+coinW) <= coinW){
						this.y = stp;
						this.h = 0;
						this.w = 0;
						this.left = Math.random()*3;
						this.dy = 0.5;
						this.lane = Math.floor(1+Math.random()*5);
						updateScore(1);
					}
				}
				if(this.y >= h+100){
					this.y = stp;
					this.h = 0;
					this.w = 0;
					this.left = Math.random()*3;
					this.dy = 0.5;
					this.lane = Math.floor(1+Math.random()*5);
				}
			}
			
			let coinSrc = getById("cn");
			
			let coins = [];
			for(let n = 0; n < ((h*0.7+100)/(gameDifficulty-50)); n++){
				coins.push(new CoinBuilder(stp+n*(gameDifficulty-50),6));
			}
			
			
			
		
			
			
			
			function rectPoints(n,ho){
				n = totalRso-n-1;
				let y1 = stp+maxH*cnst1*(Math.pow(1/ratio,n)-1);
				let x1 = roadLeft-roadConstant*(y1-stp);
				let y2 = y1;
				let x2 = x1 + minWidth+(y1-stp)*dif/totalHeight;
				let y3 = y1 + maxH*cnst1*(Math.pow(1/ratio,n+1)-1);
				let x3 = roadLeft-roadConstant*(y3-stp);
				let y4 = y3;
				let x4 = x3 + minWidth+(y3-stp)*dif/totalHeight;
				
				return [x1,y1,x2,y2,x4,y4,x3,y3];
			}
			
			
			for(let n = 0; n < totalRso; n++){
				rso.push(rectPoints(n,h));
				rso[n][8] = "black";
			}
			
			function draw(){
				ctx.beginPath();
				ctx.moveTo((w-roadWidth)/2,stp);
				ctx.lineTo((w-roadWidth)/2+roadWidth,stp);
				ctx.lineTo(w,h);
				ctx.lineTo(0,h);
				ctx.fillStyle="#696969";
				ctx.fill();
				ctx.closePath();
				for(let n = 0; n < totalRso; n++){
					ctx.beginPath();
					ctx.moveTo(rso[n][0],rso[n][1]);
					ctx.lineTo(rso[n][2],rso[n][3]);
					ctx.lineTo(rso[n][4],rso[n][5]);
					ctx.lineTo(rso[n][6],rso[n][7]);
					ctx.lineTo(rso[n][0],rso[n][1]);
					ctx.lineWidth = 2;
					ctx.fillStyle = rso[n][8];//"rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
					ctx.fill();
					ctx.closePath();
					
					ctx.beginPath();
					ctx.moveTo(w-rso[n][0],rso[n][1]);
					ctx.lineTo(w-rso[n][2],rso[n][3]);
					ctx.lineTo(w-rso[n][4],rso[n][5]);
					ctx.lineTo(w-rso[n][6],rso[n][7]);
					ctx.lineTo(w-rso[n][0],rso[n][1]);
					ctx.lineWidth = 2;
					ctx.fillStyle = rso[n][8]; //"rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
					ctx.fill();
					ctx.closePath();
					
					
				}
				
			}
			
			let cx = (w-carW)/2;
			let cl = false, cr = false;
			let car = getById("char");
			let ms = 3*w/560;
			function drawCar(){
				if(cl) if(cx+carW+50 < w) cx+=ms;
				if(cr) if(cx-50 > 0) cx-=ms;
				ctx.drawImage(car,cx,h-carH,carW,carH);
			}
			
			
			let m = 0;
			let intv = setInterval(function(){
				try{
				ctx.clearRect(0,0,w,h);
				maxH+=0.5;
				changedHeight = maxH*cnst1*(Math.pow(1/ratio,totalRso-1)-1);//maxH*(1-Math.pow(ratio,totalRso-5))/(1-ratio);
				if(changedHeight >= totalHeight){
					maxH = maxHF;
					m++;
				}
				for(let n = 0; n < totalRso; n++){
					rso[n]=rectPoints(n,h-totalHeight+changedHeight);
					if(m%2==0) rso[n][8] = "black";
					else rso[n][8] = "black";
				}
				draw();
				for(let n = 0; n < trees.length; n++){
					trees[n].draw();
				}
				
				for(let n = 0; n < coins.length; n++){
					coins[n].draw();
				}
				
				for(let n = 0; n < cars.length; n++){
					cars[n].draw();
				}
				
				
				drawCar();
				}catch(err){
					
				}
				
			},10)
			//draw();
			
			function getKey(e){
				e.preventDefault();
				let ty = e.keyCode;
				if(ty===39){
					cr = false;
					cl = true;
				}
				else if(ty===37){
					cl = false;
					cr = true;
				}
			}
			function getKeyEnd(e){
				let ty = e.keyCode;
				if(ty === 39) cl = false;
				else if(ty === 37) cr = false;
			}
			
			document.body.removeEventListener("keydown",getKey);
			document.body.removeEventListener("keyup",getKeyEnd);
			document.body.addEventListener("keydown",getKey);
			document.body.addEventListener("keyup",getKeyEnd);
		}
		ld = function(){
			if(loaded){
				document.getElementById("startPage").style.display = "none";
				document.getElementById("mainContainer").style.display = "block";
				loadGame();
			}
		}
		})();
		
		