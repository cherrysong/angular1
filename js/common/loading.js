/**
 * version:	 		    3.0
 * creatTime: 	 		2015.12.10
 * updateTime: 			2016.1.6
 * author:				xieyq
 * name:  				loading
 * 用于声明加载动画的方法
 **/
define(['jquery','spin'], function ($,spin) {
	var opts = {
		lines : 13,
		length: 12,
		width: 10,
		radius: 30,
		corners: 1,
		rotate: 0,
		direction: 1,
		color: '#5882FA',
		speed: 1,
		trail: 60,
		shadow: false,
		hwaccel: false,
		className: 'spinner',
		zIndex: 2e9,
		top: 'auto',
		left: 'auto'
	}
	var spinner = new spin(opts);
	return spinner;
})
