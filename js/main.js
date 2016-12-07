/**
 * version:	 		    1.0.0
 * creatTime: 	 		2016.08.04
 * updateTime: 			2016.08.04
 * author:				zhaoyaoyao
 * name:  				main
 **/
var urlArgs = 'ver=1.0.0';//版本号
require.config({
	baseUrl : '../js/',
	urlArgs: urlArgs,
	paths : {
		'jquery' : 'common/jQuery.v1.11.1.min',
		'wdatepicker':'common/My97DatePicker/WdatePicker',
		'angular':'common/angular',
		'app':'common/app',
		'bootstrap':'common/bootstrap',
		'loading':'common/loading',
		'spin':'common/spin.min',
		'Snap':'common/snap.svg-min',
		'echarts':'common/echarts-all',
		'jqueryPage':'common/jquery.page',
		'tree':'tree.min',
		'leftTree':'tree',
		'global':'global',
		'map':'map',
		'operateAreaMap':'operateAreaMap',
		'map-function':'map-function',
		'sftjksh-charts':'sftjksh-charts',
		'dyfx':'dyfx',
		'url':'url'
	},
	shim : {
		'angular' : {
			deps : ['jquery'],
			exports : 'angular'
		},
		'swiper':{
			deps:['jquery']	
		},
		'tree':{
			deps : ['jquery'],
			exports : 'tree'
		},
		'jqueryPage':{
			deps : ['jquery'],
			exports : 'jqueryPage'
		}
		
	}
});

require([], function () {
	var jsurl = $('body').data('js');
	if (jsurl) {
		require(['../' + jsurl]);
	}
});