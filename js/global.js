/**
 * version:	 		    1.0.0
 * creatTime: 	 		2016.08.05
 * updateTime: 			2016.08.05
 * author:				zhaoyaoyao
 * name:  				global.js
 **/
 define(['jquery','loading'],function($,loading){
     var global = {
        //获取路径中的参数
     	getQueryString:function(name,url){
     		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = url.substr(1).match(reg);
			if (r != null) {
				return unescape(r[2]);
			}
			return null;
     	},
        //获取localSorage中的数据
     	findLocalStorage:function(str){
             "user strict";
			var requestStr = localStorage.getItem(str);
			return requestStr;
     	},
        //缓存中保存数据
     	saveLocalStorage:function (name, value){
            try {
                localStorage.setItem(name, value);
            } catch (e) {
                localStorage[name] = value;
            }
		},
		getMapid:function(){
			var mapId=global.findLocalStorage('mapId');
			return mapId;
		},
		loading:function(){
//        	$(window.top.document).find('body').append('<div  class="fd-loading"><div  class="fd-text">正在加载......</div></div>');
        	$(document.body).append('<div class="fd-cloud" id="jsFdCloud"></div>');
        	loading.spin($('#jsFdCloud').get(0));
        },
        removeLoading:function(){
        	/*if(	$(window.top.document).find('.fd-loading').length>0){
        		$(window.top.document).find('.fd-loading').remove();
        	}*/
        	if($('#jsFdCloud').length > 0) {
        		$('#jsFdCloud').remove();
        	}
        },
        //获取所有的参数
        getLocalStoregeParam:function(){
            var obj={};
                obj.mapId=localStorage.getItem('mapId')==null?'000000':localStorage.getItem('mapId');
                obj.fyjb=localStorage.getItem('fyjb')==null?1:localStorage.getItem('fyjb');
                obj.ajlx=localStorage.getItem('ajlx')==null?"00":localStorage.getItem('ajlx');
                obj.spcx=localStorage.getItem('spcx')==null?"00":localStorage.getItem('spcx');
                obj.ksrq=localStorage.getItem('ksrq')==null?'201601':localStorage.getItem('ksrq');
                obj.jsrq=localStorage.getItem('jsrq')==null?'201607':localStorage.getItem('jsrq');
                obj.type=localStorage.getItem('type')==null?'xs':localStorage.getItem('type');
                obj.pxmc=localStorage.getItem('pxmc')==null?'ajs':localStorage.getItem('pxmc');
                obj.pxlx=localStorage.getItem('pxlx')==null?0:localStorage.getItem('pxlx');
                obj.sffy=localStorage.getItem('sffy')==null?false:localStorage.getItem('sffy');
                obj.xxkjb=localStorage.getItem('xxkjb')==null?1:localStorage.getItem('xxkjb');
                obj.fyjc=localStorage.getItem('fyjc')==null?'全国':localStorage.getItem('fyjc');
            return obj;
        },
        handleTb:function(tb){
            var data = parseFloat(tb);
            var str="--";
            if(data>0){
                data = data.toFixed(2);
                str="↑ "+data+"%";
            }else if(data<0){
                data = -data;
                str="↓ "+data.toFixed(2)+"%";
            }else if(data==0){
                str=data.toFixed(2)+"%";
            }else if(data=='--'||data==''){
                str="--"
            }
            return str;
        },
        //获取项目路径
        getLocalPath : function () {
            var curWwwPath = window.location.href;

            var pathName = window.location.pathname;

            var pos = curWwwPath.indexOf(pathName);

            var localhostPaht = curWwwPath.substring(0, pos);

            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            return (localhostPaht + projectName + '/');
        },
        //处理时间的格式
        handleTime:function(time){
            var year = time.substring(0,4);
            var mon = time.substring(4,6);
            return year+"年"+mon+"月";
        },
        //法院列表显示,如果超过10个字就展现...
        subAymc : function(val) {
            var subS = val;
            var length = val.length;
            if(length > 12) {
                subS = val.substr(0, 11) + '...';
            }
            return subS;
        },
     }
     return global;
 })