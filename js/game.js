class Game {
	constructor() {
		this.state = { 
			ongoing : false, 
			winOrlose : false
		};
		this.control = true;  //游戏开始|暂停
		this.box = {
			element:document.getElementById("box"),
			originWidth:720,  //源宽高
			originHeight:420,
			width:0,  //当前宽高
			height:0,
			scaleX:1, //缩放比
			scaleY:1,
		};
		this.ctx = {     //画布
			canvas1 : document.getElementById("canvas1"),
			ctx1 : document.getElementById("canvas1").getContext("2d"),
		};
		this.time = {    //时间
			lastTime : 0,
			deltaTime : 0, //每帧间隔时间
		};
		this.onKeepKey = { //当前正在按的按键
			left:{
				keyCode: 37,
				time: 0,
				func: '',
				on: false,
			},
			right:{
				keyCode: 39,
				time: 0,
				func: '',
				on: false,
			},
			up:{
				keyCode: 38,
				time: 0,
				func: '',
				on: false,
			},
			down:{
				keyCode: 40,
				time: 0,
				func: '',
				on: false,
			},
			enter:{
				keyCode: 13,
				time: 0,
				func: '',
				on: false,
			},
		};
	}
	
	init(){
		//界面尺寸调整
		game.init_box();
		game.init_ctx(); 
		//加载资源
		
		//键盘鼠标初始化
		this.init_keyBoard();

		//读取存储数据？ 关卡数据
		this.gameloop();
	}

	init_box(){
		this.box.width = this.box.element.offsetWidth;
		this.box.height = this.box.width *7/12;
		this.box.scaleX = this.box.width / this.box.originWidth;
		this.box.scaleY = this.box.height / this.box.originHeight;
	}

	init_ctx(){
		this.ctx.canvas1.style.transform = 'scale('+ game.box.scaleX +','+ game.box.scaleY +')';
	}

	init_keyBoard(){
		this.onKeepKey.left.func = player._move().left;
		this.onKeepKey.right.func = player._move().right;
		this.onKeepKey.up.func = player._move().up;
		this.onKeepKey.down.func = player._move().down;
		this.onKeepKey.enter.func = player._join;
		let _that = this;
		let Time = 0;
		//keydown记录按下的键，keyup取消，
		$(document).keydown(function(event){ 
			// if(Time == 0){
			// 	console.log('0');
			// 	Time = new Date();
			// }
			// console.log(new Date()-Time);

			for(let i in _that.onKeepKey){
				let val = _that.onKeepKey[i];
				if( val.keyCode == event.keyCode ){
					let newTime = new Date();
					if(!val.on){
						val.time = newTime;
						val.on = true;
						continue;
					}
					if(newTime - val.time > 200  && val.on){ //按时间>200 和 不是第一次按 ,,- - 窝草，js连续按同一个键， 按下去触发keydown,第二次触发要等500ms;
						val.func('长按');	
						
						//val.time = newTime;
						console.log('长按',i);
					}	
					// console.log(newTime - val.time);		
				}
			};
        });
		$(document).keyup(function(event){ 
			for(let i in _that.onKeepKey){
				let val = _that.onKeepKey[i];
				if( val.keyCode == event.keyCode ){
					let newTime = new Date();
					if(newTime - val.time <= 200 ){
						val.func('短按');
						console.log('短按',i);	
					}	
					val.on = false;
					val.time = 0;
				}
			};
        });
	}

	clearCanavs(){
		this.ctx.ctx1.clearRect(0,0,game.box.originWidth, game.box.originHeight);
	}

	gameloop(){  //画面循环
		let _that = this;
		window.requestAnimFrame(()=>{_that.gameloop()}); //跟随屏幕分辨率setInterval
		if(_that.control){
			var now = new Date();
			_that.time.deltaTime = now - _that.time.lastTime;
			if(_that.time.deltaTime > 40){
				_that.time.deltaTime = 40;
			}
			_that.time.lastTime = now;
			_that.clearCanavs();

			//玩家player绘制
			player._draw();

		}
	}
}


class LoadData {
	constructor() {
		this.num = 0; //图片总数
		this.successNum = 0; //成功加载数量
		this.imagesUrl = {
			person:{
				player:'images/playerGirl.png',
			},
			map:{}
		};
		this.imageObj = {
			person:{
				player:''
			},
			map:{}
		};
	}
	
	init(){
		return new Promise((resolve, reject) => {
		    let _that = this;
			_that.num = 0;
			_that.successNum = 0;
			for(let arrName in _that.imagesUrl){
				for(let src in _that.imagesUrl[arrName]){
					_that.num++;
					let Img = new Image();
					Img.src = _that.imagesUrl[arrName][src];
					console.log(_that.imagesUrl[arrName][src]);
					if(Img.complete){
						_that.imageObj[arrName][src] = Img;
						_that.successNum++;
						console.log(_that.num +' , '+ _that.successNum);
						if(_that.num == _that.successNum){
							resolve('全部资源加载完毕');
							return true;
						}
					}else{
						Img.onload = function(){
					        _that.imageObj[arrName][src] = Img;
							_that.successNum++;
							console.log(_that.num +' , '+ _that.successNum);
							if(_that.num == _that.successNum){
								resolve('全部资源加载完毕');
								return true;
							}
					    };	
					    Img.onerror=function(){
					    	reject('加载出错 '+ Img.src);
					    }; 
					}
				}
			}
		});
	}
}

window.onload=function(){
	//游戏尺寸调整
	$(window).resize(function() {
		//调整尺寸
		if(game){
			game.init_box();
		  	game.init_ctx(); 		
		}
	});

	function startGame(){
		var game = new Game();
		window.game = game;
		var player = new Player('赵日天','男','23');
		window.player = player;
		player.init();
		game.init();
	}	

	var loadData = new LoadData();
	window.loadData = loadData;
	loadData.init().then((msg)=>{
	  console.log(msg);
	  console.log('start game');
	  startGame();
	}, (error)=>{
	  console.error(error);
	});

	

};

