'use strict';

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
		this.whichKeyBoard = 'menu'; //键盘事件传递层 people  menu
		this.control = true; //游戏开始|暂停
		this.box = {
			element: '',
			originWidth: 720, //源宽高
			originHeight: 420,
			width: 0, //当前宽高
			height: 0,
			scaleX: 1, //缩放比
			scaleY: 1
		};
		this.canvas = { //画布
			elements: {
				person: '',
				background: '',
				menu: ''
			},
			ctx: {}
		};
		this.time = { //时间
			lastTime: 0,
			deltaTime: 0 };
	}

	_createClass(Game, [{
		key: 'init',
		value: function init() {
			//界面尺寸调整
			game.init_box();
			game.init_ctx();
			//加载资源

			//读取存储数据？ 关卡数据
			this.gameloop();
		}
	}, {
		key: 'init_box',
		value: function init_box() {
			this.box.element = document.getElementById("box");
			this.box.width = this.box.element.offsetWidth;
			this.box.height = this.box.width * 7 / 12;
			this.box.scaleX = this.box.width / this.box.originWidth;
			this.box.scaleY = this.box.height / this.box.originHeight;
		}
	}, {
		key: 'init_ctx',
		value: function init_ctx() {
			this.canvas.elements = {
				person: document.getElementById("canvas_person"),
				background: document.getElementById("canvas_map"),
				menu: document.getElementById("canvas_menu")
			};
			for (var name in this.canvas.elements) {
				this.canvas.ctx[name] = this.canvas.elements[name].getContext("2d");
				this.canvas.elements[name].style.transform = 'scale(' + game.box.scaleX + ',' + game.box.scaleY + ')';
			}
		}
	}, {
		key: 'clearCanavs',
		value: function clearCanavs() {
			for (var name in this.canvas.ctx) {
				this.canvas.ctx[name].clearRect(0, 0, game.box.originWidth, game.box.originHeight);
			}
		}
	}, {
		key: 'gameloop',
		value: function gameloop() {
			//画面循环
			var _that = this;
			window.requestAnimFrame(function () {
				_that.gameloop();
			}); //跟随屏幕分辨率setInterval
			//按键
			keyboard._loop_keyBoard();
			if (_that.control) {

				//清屏
				_that.clearCanavs();

				//绘制画面
				this.canvas.ctx.person.save();
				this.canvas.ctx.background.save();
				var x = player.position.x - (720 - 48) / 2;
				var y = player.position.y - (420 - 48) / 2;
				this.canvas.ctx.person.translate(-x, -y);
				this.canvas.ctx.background.translate(-x, -y);
				//地图绘制
				map._draw();
				//玩家player绘制
				player._draw();
				//菜单绘制
				menu._draw();
				this.canvas.ctx.person.restore();
				this.canvas.ctx.background.restore();

				var now = new Date();
				_that.time.deltaTime = now - _that.time.lastTime;
				if (_that.time.deltaTime > 40) {
					_that.time.deltaTime = 40;
				}
				_that.time.lastTime = now;
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
			map: {
				'm_001': 'images/mapElements01.dib'
			},
			others: {
				'border': 'images/menuframes.png',
				'triangle': 'images/triangle.png'
			}
		};
		this.imageObj = {
			person: {
				player: ''
			},
			map: {},
			others: {}
		};
	}

	_createClass(LoadData, [{
		key: 'init',
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

						if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
					}
				};

				for (var arrName in _that.imagesUrl) {
					var _ret = _loop(arrName);

					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
		var map = new Map('m_001');
		window.map = map;
		var menu = new Menu();
		window.menu = menu;
		var keyboard = new Keyboard();
		window.keyboard = keyboard;

		player.init();
		map.init();
		menu.init();
		keyboard.init();
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