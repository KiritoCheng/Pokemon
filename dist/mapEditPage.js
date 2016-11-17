'use strict';

$(function () {
	var EditObj = {
		_init: function _init() {
			this.mapList._init();
		},
		_save: function _save() {},
		mapBox: { //地图array框
			element: {},
			_init: function _init() {
				this.element = $('#mapBox .map');
				var selectedMapObj = EditObj.selectedMapObj;
				var block_element = {};
				this.element.css({ width: selectedMapObj.widthNum * 48, height: selectedMapObj.heightNum * 48 });
				var $block = $('<div  style=\'background:url("' + selectedMapObj.imgUrl + '") no-repeat;background-size:' + selectedMapObj.elements_num_x * 48 + 'px ' + selectedMapObj.elements_num_y * 48 + 'px;\'></div>');
				for (var i = 0; i < selectedMapObj.heightNum; i++) {
					for (var j = 0; j < selectedMapObj.widthNum; j++) {
						block_element = selectedMapObj.elements[selectedMapObj.array[j][i].id];
						$block.css({
							left: j * 48 + 'px',
							top: i * 48 + 'px',
							'backgroundPosition': '-' + block_element.x * 48 + 'px ' + '-' + block_element.y * 48 + 'px'
						}).attr({ x: j, y: i, key: i + '_' + j });
						this.element.append($block.clone(true));
					}
				}
				this.element.on('click', 'div', function () {
					EditObj.mapBox._click($(this).attr('x'), $(this).attr('y'));
				});
			},
			_click: function _click(x, y) {
				var selectedId = EditObj.mapElements.selectedId;
				console.log(y, '列', x, '行', selectedId);
				var i = selectedId.split("_")[0],
				    j = selectedId.split("_")[1];
				console.log(i, j, EditObj.selectedMapObj.array);
				EditObj.selectedMapObj.array[y][x].id = selectedId;
				this.element.find('div[key="' + y + '_' + x + '"]').css('backgroundPosition', '-' + j * 48 + 'px ' + '-' + i * 48 + 'px');
			}
		},
		selectedMapObj: { //选中的地图	
			name: '初始图',
			imgUrl: '',
			widthNum: 0,
			heightNum: 0,
			elements: {},
			elements_num_x: 0,
			elements_num_y: 0,
			outScreenArray: [],
			array: {}
		},
		mapList: { //地图列表
			obj: {}, //原地图列表
			element: {}, //选择框dom select 
			_init: function _init() {
				this.element = $('#mapList .selectMap');
				this.obj = window.mapList;
				for (var x in this.obj) {
					var $option = '<option value=\'' + x + '\'>' + x + '</option>';
					this.element.append($option);
				}
				this._change(this.element.val());

				this.element.change(function () {
					EditObj.mapList._change($(this).val());
				});
			},
			_change: function _change(selectedName) {
				EditObj.selectedMapObj = jQuery.extend(true, {}, this.obj[selectedName]);
				EditObj.mapElements._init();
				EditObj.mapBox._init();
			}
		},
		mapElements: {
			element: {}, //img 
			selectedElement: {}, //div.block
			selectedId: {}, // 0_1
			_init: function _init() {
				this.element = $('#elements img');
				this.selectedElement = $('#elements .block');
				var selectedMapObj = EditObj.selectedMapObj;
				this.element.attr('src', selectedMapObj.imgUrl).css({ 'width': selectedMapObj.elements_num_x * 16 * 3, 'height': selectedMapObj.elements_num_y * 16 * 3 });
				this._click(0, 0);
				this.element.on('click', function (e) {
					var offsetX = e.offsetX,
					    offsetY = e.offsetY;

					var i = parseInt(offsetY / 48),
					    j = parseInt(offsetX / 48);
					console.log(i, j);
					EditObj.mapElements._click(i, j);
				});
			},
			_click: function _click(i, j) {
				this.selectedId = i + "_" + j;
				this.selectedElement.css({ left: j * 48 + 'px', top: i * 48 + 'px' });
			}
		}

	};
	EditObj._init();
	console.log(EditObj);
});