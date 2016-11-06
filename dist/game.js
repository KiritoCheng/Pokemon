"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
	function Game() {
		_classCallCheck(this, Game);

		this.state = {
			ongoing: false,
			winOrlose: false
		};
		this.control = true; //游戏开始|暂停
		this.box = {
			element: document.getElementById("box"),
			originWidth: 720, //源宽高
			originHeight: 420,
			width: 0, //当前宽高
			height: 0,
			scaleX: 1, //缩放比
			scaleY: 1
		};
		this.ctx = { //画布
			canvas1: document.getElementById("canvas1"),
			ctx1: document.getElementById("canvas1").getContext("2d")
		};
		this.time = { //时间
			lastTime: 0,
			deltaTime: 0 };
		this.onKeepKey = { //当前正在按的按键
			left: {
				keyCode: 37,
				time: 0,
				func: '',
				on: false
			},
			right: {
				keyCode: 39,
				time: 0,
				func: '',
				on: false
			},
			up: {
				keyCode: 38,
				time: 0,
				func: '',
				on: false
			},
			down: {
				keyCode: 40,
				time: 0,
				func: '',
				on: false
			},
			enter: {
				keyCode: 13,
				time: 0,
				func: '',
				on: false
			}
		};
	}

	_createClass(Game, [{
		key: "init",
		value: function init() {
			//界面尺寸调整
			game.init_box();
			game.init_ctx();
			//加载资源

			//键盘鼠标初始化
			this.init_keyBoard();

			//读取存储数据？ 关卡数据
			this.gameloop();
		}
	}, {
		key: "init_box",
		value: function init_box() {
			this.box.width = this.box.element.offsetWidth;
			this.box.height = this.box.width * 7 / 12;
			this.box.scaleX = this.box.width / this.box.originWidth;
			this.box.scaleY = this.box.height / this.box.originHeight;
		}
	}, {
		key: "init_ctx",
		value: function init_ctx() {
			this.ctx.canvas1.style.transform = 'scale(' + game.box.scaleX + ',' + game.box.scaleY + ')';
		}
	}, {
		key: "init_keyBoard",
		value: function init_keyBoard() {
			this.onKeepKey.left.func = player._move().left;
			this.onKeepKey.right.func = player._move().right;
			this.onKeepKey.up.func = player._move().up;
			this.onKeepKey.down.func = player._move().down;
			this.onKeepKey.enter.func = player._join;
			var _that = this;
			//keydown记录按下的键，keyup取消，
			$(document).keydown(function (event) {
				for (var i in _that.onKeepKey) {
					var val = _that.onKeepKey[i];
					if (val.keyCode == event.keyCode) {
						var newTime = new Date();
						if (newTime - val.time > 200 && val.on) {
							//按时间>200 和 不是第一次按
							val.func('长按');
							val.time = newTime;
							console.log('长按', i);
						} else {
							console.log('no');
							val.on = true;
							//val.time = newTime;
						}
						if (!val.on) {
							val.time = newTime;
						}
					}
				};
			});
			$(document).keyup(function (event) {
				for (var i in _that.onKeepKey) {
					var val = _that.onKeepKey[i];
					if (val.keyCode == event.keyCode) {
						var newTime = new Date();
						if (newTime - val.time <= 200) {
							val.func('短按');
							console.log('短按', i);
							val.on = false;
							val.time = 0;
						}
					}
				};
			});
		}
	}, {
		key: "clearCanavs",
		value: function clearCanavs() {
			this.ctx.ctx1.clearRect(0, 0, game.box.originWidth, game.box.originHeight);
		}
	}, {
		key: "gameloop",
		value: function gameloop() {
			//画面循环
			var _that = this;
			window.requestAnimFrame(function () {
				_that.gameloop();
			}); //跟随屏幕分辨率setInterval
			if (_that.control) {
				var now = new Date();
				_that.time.deltaTime = now - _that.time.lastTime;
				if (_that.time.deltaTime > 40) {
					_that.time.deltaTime = 40;
				}
				_that.time.lastTime = now;
				_that.clearCanavs();

				//玩家player绘制
				player._draw();
			}
		}
	}]);

	return Game;
}();

var LoadData = function () {
	function LoadData() {
		_classCallCheck(this, LoadData);

		this.num = 0; //图片总数
		this.successNum = 0; //成功加载数量
		this.imagesUrl = {
			person: {
				player: 'images/playerGirl.png'
			},
			map: {}
		};
		this.imageObj = {
			person: {
				player: ''
			},
			map: {}
		};
	}

	_createClass(LoadData, [{
		key: "init",
		value: function init() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				var _that = _this;
				_that.num = 0;
				_that.successNum = 0;

				var _loop = function _loop(arrName) {
					var _loop2 = function _loop2(src) {
						_that.num++;
						var Img = new Image();
						Img.src = _that.imagesUrl[arrName][src];
						console.log(_that.imagesUrl[arrName][src]);
						if (Img.complete) {
							_that.imageObj[arrName][src] = Img;
							_that.successNum++;
							console.log(_that.num + ' , ' + _that.successNum);
							if (_that.num == _that.successNum) {
								resolve('全部资源加载完毕');
								return {
									v: {
										v: true
									}
								};
							}
						} else {
							Img.onload = function () {
								_that.imageObj[arrName][src] = Img;
								_that.successNum++;
								console.log(_that.num + ' , ' + _that.successNum);
								if (_that.num == _that.successNum) {
									resolve('全部资源加载完毕');
									return true;
								}
							};
							Img.onerror = function () {
								reject('加载出错 ' + Img.src);
							};
						}
					};

					for (var src in _that.imagesUrl[arrName]) {
						var _ret2 = _loop2(src);

						if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
					}
				};

				for (var arrName in _that.imagesUrl) {
					var _ret = _loop(arrName);

					if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
				}
			});
		}
	}]);

	return LoadData;
}();

window.onload = function () {
	//游戏尺寸调整
	$(window).resize(function () {
		//调整尺寸
		if (game) {
			game.init_box();
			game.init_ctx();
		}
	});

	function startGame() {
		var game = new Game();
		window.game = game;
		var player = new Player('赵日天', '男', '23');
		window.player = player;
		player.init();
		game.init();
	}

	var loadData = new LoadData();
	window.loadData = loadData;
	loadData.init().then(function (msg) {
		console.log(msg);
		console.log('start game');
		startGame();
	}, function (error) {
		console.error(error);
	});
};