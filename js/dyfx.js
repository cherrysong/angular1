/**
 * version:	 		    1.0.0
 * creatTime: 	 		2016.08.05
 * updateTime: 			2016.08.05
 * author:				zhaoyaoyao
 * name:  				dyfx.js
 **/
 define(['jquery','global','url','map'],function($,global,url){
 	var dyfxObj = {
 		params:{

 		},
        init:function(){
           global.saveLocalStorage("pxlx",0);
           global.saveLocalStorage("pxmc",'AJS');
           global.saveLocalStorage("sffy",false);//是否分页，默认不分页
           global.saveLocalStorage("xxkjb",1);//选项卡级别，1辖区
           //获取数据
           dyfxObj.initData();
          // dyfxObj.onmessage();
          // dyfxObj.initEvent();
        },
        //获取数据
        initData:function(){

        },
        
        getRightList:function(){
            var obj;
            var params = global.getLocalStoregeParam();
        	$.ajax({
         		type:'get',
         		data:{'param':JSON.stringify(params)},
         		url:url.areaMap,
         		dataType : 'json',
			    async : false,
			    success:function(result){
                    obj = result.result;
			    },
			    error:function(e){
//			    	console.log(e);
			    }
         	})
            return obj;
        } ,
        initEvent:function(){
        	//高院点击
        	$(".js-dyfx-list-nav").off("click.li").on("click.li","li",function(){
        		var _this = $(this);
                var index = _this.index();
                global.saveLocalStorage("xxkjb",index+1);
        		if(_this.hasClass("fd-active")){
        			return;
        		}
        		_this.addClass("fd-active").siblings().removeClass("fd-active");

        	})
        	//排序按钮的点击事件
        	$("#js-ajs-sort,#js-tb-short").on("click",function(){
        		var _this = $(this);
        		if(_this.hasClass("fd-active")){
        			return ;
        		}else{
        			_this.addClass("fd-active").parent().siblings().find(".js-list-btn").removeClass("fd-active");
        		}
        	})
            //查看更多按钮的点击
            $(".js-list-all").click(function(){
                window.open("../html/sftj-list.html");
            })
        }  

 	};
 	dyfxObj.init();
    return dyfxObj;
 })