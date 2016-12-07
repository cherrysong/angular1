/**
 * version:	 		    1.0.0
 * creatTime: 	 		2016.08.04
 * updateTime: 			2016.08.04
 * author:				zhaoyaoyao
 * name:  				map.js
 **/
 define(['jquery','global','operateAreaMap','map-function','url','app','bootstrap'],function($,global,operateAreaMap,jrdtAreaMap,globalUrl,app,bootstrap){
 	app.controller('dyfxCtrl',function($scope){
      
     var params_dyfx = {
     	      mapId:'000000',
               ksrq:'201601',
               jsrq:'201607',
               ajlx:0,
               spcx:0,
               type:'xs',
               pxmc:'TB',
               pxlx:0,//0是降序，1是升序
     }

 	/**
	 * handleMapDataList 
	 * 插入新的对象xinjiangGroup
	 * author：tangqian
	 * createTime：2016.7.12
	 */
	var xinjiangGroup={
			ajs:0 ,  
            tb :0,  
	};
    function handleMapDataList(mapId,mapDataList){
  	  var mapDataList=mapDataList;
  	  if(mapId=='000000'){
  		  var xinjiang={
  				    ajs:0 ,  
	                tb :0,  
  		  },
  		  bingtuan={
  				    ajs:0 ,  
	                tb :0,  
  		  };
  		  $.each(mapDataList,function(index,value){
  			  if(value.mapId=='520000'){
  				  bingtuan=value;
  			  }else if(value.mapId=='480000'){
  				  xinjiang=value;
  			  }
  		  });
  		  var xinjiangG={
  				    mapId : "xinjiangGroup", 
  	                linkStatus:false,  
  	                name : "新疆and兵团", 
  	                ajs: parseInt(xinjiang.ajs+bingtuan.ajs) ,  
  	                tb : parseFloat(xinjiang.tb+bingtuan.tb),  
  		  };
  		  xinjiangGroup=xinjiangG;
  		  mapDataList.push(xinjiangG);
  		  
  	  }
  	  return mapDataList;
  	  
    }

 	var success,
        message,
        hbMax,
        mapDataList,
        valueMax = 0,
        minValue = 0,
        sjFlag = 1,
        ajsMax = 2000,
        tbMax=100,
        tbMin = 0,
        ajsMin = 0,
        isXinshou = true,
        myMap = null,
        timer = null;
    var gradient = new jrdtAreaMap.GradientColor('#d4f7fd','#0066bd', 200); // 渐变颜色
	
	var areaMapColor = []; //存放颜色数组
	function getAreaMapColor(colorStep) {
		areaMapColor = []; //存放颜色数组
		for (var i = 0; i < colorStep; i++) {
			(function (i) {
				var index = Math.floor(200 / (colorStep - 1)) * i;
				if (index > 200 || index === 200) {
					areaMapColor.push(gradient[199]);
				} else {
					areaMapColor.push(gradient[index]);
				}
			})(i);
		}

		// 转换成 rgba() 颜色值
		if(areaMapColor){
			
		}
		areaMapColor = $.map(areaMapColor, function (element, index) {
				element = element.substring(0, 3) + 'a' + element.substring(3, element.indexOf(')')) + ',1)';
				return element;
			});
	}

	// 获取总共的颜色值，默认七个
	getAreaMapColor(7);
  
    //  初始化地图
    function initMap(url, mapDataList, mapId, initialPage) {
        
		"user strict";

		//  是否是初始化页面
		var initialPage = initialPage ? initialPage : false;
       if ($('#js-ajs-sort').hasClass('fd-active')) {
       	    valueMax = ajsMax;
			minValue = 0;
			isXinshou = true;
		} else if ($('#js-tb-sort').hasClass('fd-active')) {
			valueMax = tbMax;
			minValue = tbMin;
			isXinshou = false;
		}
		
		var myMap = operateAreaMap;
		myMap.newData=mapDataList;
		
		if (initialPage) {
				
			// 设置地图，无论是ajax加载还是从localstorage中加载都走这个方法
			function setSvgMap(response){
				
				//  如果存在地图对象那么得销毁
				if (myMap) {
					//  销毁对象
					myMap.destory();
					myMap = null;
					colorControl = null;
				}
				
				// 地图加载完毕
				$("#map").html(response);

				var snap = Snap('#svgMap');

				snap.attr({
					width : '100%',
					height : '100%',
					'visibility' : 'hidden'
				});

				// 重新new出一个新的map对象
				myMap = operateAreaMap;

				// 更新颜色区间   当单省 高级法院时，会出现mapDataList.length==1的情况  虽然需求已经变更为单省时不可选择高级法院，此处还是加了判断 20160331  tangqian 
				getAreaMapColor(mapDataList.length==1?30:mapDataList.length);

				// 是否是大地图
				var isMaxMap = false;

				if (mapId == 'mapid-sevent' || mapId == 'mapid-qg0000' || mapId == 'mapid-xb0000' || mapId == 'mapid-xn0000' || mapId == 'mapid-hb0000' || mapId == 'mapid-hd0000' || mapId == 'mapid-hz0000' || mapId == 'mapid-hn0000' || mapId == 'mapid-db0000') {
					isMaxMap = true;
				}
				
                
                //  是否显示区域名字
				//var isShowNameText = global.findLocalStorage('isShowNameText') == 'false';
                //是否显示数据文本
				//var isShowDataText = global.findLocalStorage('isShowDataText') == 'false';
				 isShowNameText = false;
				 isShowDataText = false

				//  创建map数据
				myMap.setOptions({
					snap : snap,
					isMaxMap : isMaxMap, // 是否是大地图
					isXinshou : isXinshou, //是否是新收
					tbMax : valueMax, // 新收的最大值
					isShowNameText : isShowNameText, // 是否显示区域名字
					isShowDataText : isShowDataText, // 是否显示数据文本
					ajsMax : null, // 已结的最大值
					areaMapColor : areaMapColor,
					dataMaxValue:valueMax,
					dataMinValue:minValue,
					series : {
						data : mapDataList
					},
					clickCallback : function (event, _this, dataList) {

						if (

							dataList.mapId == '180000' ||
							dataList.mapId == '170000' ||
							dataList.mapId == '160000' ||
							dataList.mapId == 'db0000' ||

							dataList.mapId == '150000' ||
							dataList.mapId == '140000' ||
							dataList.mapId == '130000' ||
							dataList.mapId == '120000' ||
							dataList.mapId == '110000' ||
							dataList.mapId == 'hb0000' ||

							dataList.mapId == '190000' ||
							dataList.mapId == '270000' ||
							dataList.mapId == '280000' ||
							dataList.mapId == '290000' ||
							dataList.mapId == '300000' ||
							dataList.mapId == '310000' ||
							dataList.mapId == '320000' ||
							dataList.mapId == 'hd0000' ||

							dataList.mapId == '380000' ||
							dataList.mapId == '370000' ||
							dataList.mapId == '360000' ||
							dataList.mapId == 'hn0000' ||

							dataList.mapId == '340000' ||
							dataList.mapId == '350000' ||
							dataList.mapId == '330000' ||
							dataList.mapId == 'hz0000' ||

							dataList.mapId == '520000' ||
							dataList.mapId == '480000' ||
							dataList.mapId == '470000' ||
							dataList.mapId == '460000' ||
							dataList.mapId == '450000' ||
							dataList.mapId == '440000' ||
							dataList.mapId == 'xb0000' ||

							dataList.mapId == '430000' ||
							dataList.mapId == '420000' ||
							dataList.mapId == '410000' ||
							dataList.mapId == '400000' ||
							dataList.mapId == '390000' ||
							dataList.mapId == 'xn0000') {

							//  重新记录previous  mapid 是什么
							global.saveLocalStorage('mapIdPrevious', global.saveLocalStorage('mapId'));

							// 重新保存mapid
							global.saveLocalStorage('mapId', dataList.mapId);

							// 触发父类的按钮，改变左侧导航的文字
							$(window.parent.document).find('#triggerMap').trigger('click');
							 //触发树节点的点击事件
			             	var message={
									message:'changeMap',
									data:{
									}
								};
								//点击组织机构树
							$(window.parent.document).find("#fd-treeMax-"+dataList.mapId).trigger("click");
			                // window.parent.parent.postMessage(JSON.stringify(message),'*');					
							//  刷新页面
							//refreshPage(dataList.mapId, true);
						} else {
							//console.log('不可以下钻了！')
						}
					}
				});

				//  显示隐藏数据按钮click事件(这个只有热点图页面有)
				$("#showHideDataText").off('click').on('click', function () {

					var isShowDataText = global.findLocalStorage('isShowDataText');
					
					if (isShowDataText == 'true') {

						myMap.isShowDataText = true;

						// 显示数据
						myMap.showDataText();

						// 隐藏提示框
						myMap.isShowTooltip = false;

						//显示图例
						$('.js-xinshou,.js-yijie').removeClass('fd-hide');

					} else {

						myMap.isShowDataText = false;

						// 隐藏数据
						myMap.hideDataText();

						// 显示提示框
						myMap.isShowTooltip = true;

						//隐藏图例
						$('.js-xinshou,.js-yijie').addClass('fd-hide');
					}
				});
                
                //  控制颜色对象设置参数
				colorControl = jrdtAreaMap.colorControl({
					maxValue : valueMax,
					minValue : minValue,
					gradient: gradient,
					mouseup : function (maxValue, minValue) {
						myMap.setMinValue(minValue);
						myMap.setMaxValue(maxValue);
					}
				});
                 //  初始化   
                 colorControl.init();
                 //案件数和同比的点击事件
				$('#js-ajs-sort, #js-tb-sort').off('click').on('click', function () {
				// 绑定新收已结点击事件
				//$('.js-sign-xinshou ,.js-sign-yijie').off('click').on('click', function () {
                    //重新设置是否分页的值
                    global.saveLocalStorage("sffy",false);
                    var _this = $(this);
                    var mc = _this.attr("data-name");
                    params_dyfx.pxmc = mc;
                    var sortId=_this.attr("data");
                    params_dyfx.pxlx = sortId;
                    global.saveLocalStorage("pxlx",sortId);
                    global.saveLocalStorage("pxmc",mc);
                    var index;
                    if(mc =='AJS'){
                    	index = 0;
                    }else{
                    	index = 1;
                    }
                        //改变data的值控制升序降序
                        if(sortId == '0'&&_this.hasClass("fd-active")){//0 降序，1升序
                            _this.attr("data",1);
                            _this.find(".js-arrow").addClass("fd-sort-up");
                            params_dyfx.pxlx = 1;
                            global.saveLocalStorage("pxlx",1);
                            //从新获取数据
                            //getRightList();
                        }else if(sortId =='1'&&_this.hasClass("fd-active")){//降序
                           _this.attr("data",0); 
                           _this.find(".js-arrow").removeClass("fd-sort-up");
                           params_dyfx.pxlx = 0;
                           global.saveLocalStorage("pxlx",0);
                           //从新获取数据
                           //getRightList();
                        }else if((sortId==''||sortId==undefined)&&!_this.hasClass("fd-active")){
                            params_dyfx.pxlx = 0;
                           _this.attr("data",0); 
                           global.saveLocalStorage("pxlx",0);
                           //从新获取数据
                           //getRightList();
                        }else{
                           //getRightList();
                        }
                        //判断是否是辖区，从新刷新地图数据
                        var xqStatus = $(".js-dyfx-list-nav").find(".fd-active").index();
                       
					if ($(this).hasClass('fd-active')) {
						if(xqStatus==0){
                        	var mapId = global.findLocalStorage("mapId");
                           refreshPage(mapId, false);
                        }else{
                        	getRightList();
                        }
						return;
					} else {
						$(this).addClass("fd-active");
						 $(this).parent().siblings().find(".js-list-btn").removeClass("fd-active");
						 $(".fd-btn-item").eq(index).addClass("fd-active").siblings().removeClass("fd-active");
						 //判断是不是辖区
						 if(xqStatus==0){
                        	var mapId = global.findLocalStorage("mapId");
                        	//案件数
                        	var rightList = getRightList();
	                           if ($(this).is('#js-ajs-sort')) {
								//  判断是否是新收的数据
								myMap.isXinshou = true;
								var obj = getMaxData();
								valueMax = obj.maxValue;
								minValue = obj.minValue;

								} else {//同比
									//  判断是否是新收的数据
									myMap.isXinshou = false;
									var obj = getMaxData();
									valueMax = obj.maxValue;
									minValue = obj.minValue;

								}
							// 先设置值区域
							myMap.setAreaMapDataRange();

							//  再设置颜色控制条最大值
							updataRangeAfterObj = colorControl.updateMax(valueMax,minValue);

							// 再设置地图的最大值和最小值
							myMap.setMaxValue(updataRangeAfterObj.currentMaxValue);
							myMap.setMinValue(updataRangeAfterObj.currentMinValue);

							// 后重新修改区域地图的颜色，
							myMap.mendAreaMapFillColor();

							// 最后填充地图颜色
							myMap.setAreaMapFillColor();
							
							//  更新数据文本
							myMap.updateDataText();	

							myMap.setWaterText(rightList);
                        }else{
                        	getRightList();
                        }
					}
				});

				
				myMap.newData=mapDataList;
				//  刷洗地图数据的按钮
				/*$('#refreshMap').off('click').on('click', function () {
					myMap.updateData();
				});*/
				myMap.updateData(mapDataList);

				//  是否显示区域名字
				$('#showHideNameText').off('click').on('click', function () {

					var isShowNameText = global.findLocalStorage('isShowNameText') == 'true' ? true : false;
						myMap.isShowNameText = isShowNameText;
						myMap.showOrHideNameText();
				});	
			};
			
			if(!!global.findLocalStorage('svgMap'+mapId)){
				var  startMapIdIndex=url.lastIndexOf('mapid-');
				var  lastMapIdIndex=url.lastIndexOf('mapid-');
				var  mapIdName=url.substring(startMapIdIndex+6,lastMapIdIndex);
				// 加载动画
				global.loading();
				 //  获取svg地图	
				var  response=global.findLocalStorage('svgMap'+mapIdName);
				//地图加载成功后进行的操作
				setSvgMap(response);
				
				// 完成动画
				global.removeLoading();	
				
			}else {
				$.ajax({
					type : "GET",
					url : url,
					data : null,
					dataType : 'text',
					beforeSend:function(){
						global.loading();
					},
					complete:function(){
						global.removeLoading();	
					},
					success : function (response) {
						var  startMapIdIndex=url.lastIndexOf('mapid-');
						var  lastMapIdIndex=url.lastIndexOf('mapid-');
						var  mapIdName=url.substring(startMapIdIndex+6,lastMapIdIndex);
						//  储存svg地图	
						global.saveLocalStorage(('svgMap'+mapIdName),response);
						//地图加载成功后进行的操作
						setSvgMap(response);				
					},
					error : function (info) {
						throw new Error('加载地图失败' + info);
					}
				});
				
			}
			
		} else {
			//  更新地图
//			$('#refreshMap').trigger('click');
			myMap.updateData(mapDataList);
			//修改水滴
			myMap.setWaterText($scope.rightList);

		}

	
    }
    
    //  根据点击去的id查页面
    function refreshPage(mapId, initialPage) {
    	
        
		if (mapId == '000000'||mapId == 'sevent') {
			$('#returnPreviousMap').hide();
		} else {
			if ($('#returnPreviousMap').is(':hidden')) {
				$('#returnPreviousMap').show();
			}	
		};
		//  是否是初始化页面
		var initialPage = initialPage ? initialPage : false;
        var url=globalUrl.areaMap(mapId);//'../json/mapid-' + mapId + '.json';
        
        
      
        var param=global.getLocalStoregeParam();
		//var url='../jrdtSssjLogic.do?action=getDtData';
		$.ajax({
			type : 'post',
			url :url ,
			dataType : 'json',
			data :{
				"param" : JSON.stringify(
						param
				)
			},  //  传入到后台的数据
			success : function (response, status, xrh) {

            var response = response,
			//	var response = response;
				success = response.success,
				message = response.message;
	           
				// 后台查询数据成功
				if (success) {
					var result = response.result;
					var title = result.title;
					//$(window.parent.document).find(".js-sftj-title").text(title);
					$scope.rightList = result.dataList;
					$scope.$apply();
					mapDataList = result.mapDataList;
					if ($('#js-ajs-sort').hasClass('fd-active')) {
						if($("#js-ajs-sort").find(".fd-arrow-down").hasClass("fd-sort-up")){
			               ajsMax = mapDataList[mapDataList.length-1].ajs;
			               ajsMin = mapDataList[0].ajs;
						}else{
						   ajsMax = mapDataList[0].ajs;
						   ajsMin = mapDataList[mapDataList.length-1].ajs;
						}
					} else if ($('#js-tb-sort').hasClass('fd-active')) {
						if($('#js-tb-sort').find(".fd-arrow-down").hasClass("fd-sort-up")){
							tbMax = mapDataList[mapDataList.length-1].tb;
							tbMin = mapDataList[0].tb;
						}else{
							tbMax = mapDataList[0].tb;
							tbMin = mapDataList[mapDataList.length-1].tb;
						}
			
					}
					/*tbMax = Number(result.tbMax) > 0 ? Number(result.tbMax) : tbMax; //新收的最大值
					ajsMax = Number(result.ajsMax) > 0 ? Number(result.ajsMax) : ajsMax; //已结的最大值*/
					mapDataList = handleMapDataList(mapId,result.mapDataList); //地图数据列表
					if(mapId=="000000"){
						if(ajsMax < xinjiangGroup.ajs){
						ajsMax=xinjiangGroup.ajs;
					    }
						if(tbMax < xinjiangGroup.tb){
							tbMax=xinjiangGroup.tb;
						}
					}
					
					// 初始化地图的数据
					initMap('../svg/mapid-' + mapId + '.svg',result.mapDataList, mapId, initialPage);
					//var fymlUrl='http://192.2.0.145:8090/fyml/fyml/fymlsy/fyml.html';
					if(mapId=='000000'||mapId=='sevent'||mapId=='hb0000'||mapId=='db0000'||mapId=='hd0000'
						||mapId=='hz0000'||mapId=='hn0000'||mapId=='xn0000'||mapId=='xb0000'){
						$(".js-fd-toUrl").css({
							'display':'none'
						});
					}else{
						var toUrl='';
					   	if(toUrl!=response.result.toUrl){
					   		toUrl=response.result.toUrl;
					   	}
						$(".js-fd-toUrl").css({
							'display':'inherit'
						});
						$(".js-fd-toUrl").off('click').on('click',function(){
							window.open(toUrl, 'newwindow' + new Date().getTime());
						});
						
					}

				} else {
					throw new Error('后台请求数据为空：' + message)
				}
			},
			error : function (response, status, xrh) {
				throw new Error('后台请求数据不成功，错误信息：' + status)
			}
		});
	
    }
    function getMaxData(){
    	var mapId = global.getMapid();
    	var url=globalUrl.areaMap(mapId);//'../json/mapid-' + mapId + '.json';
        var param=global.getLocalStoregeParam();
		//var url='../jrdtSssjLogic.do?action=getDtData';
		var maxData,minData;
		var obj={};
		$.ajax({
			type : 'post',
			url :url ,
			dataType : 'json',
			data :{
				"param" : JSON.stringify(
						param
				)
			},  //  传入到后台的数据
			async:false,
			success : function (response, status, xrh) {

            var response = response;
            var mapDataList = response.result.mapDataList;
            //mapDataList = handleMapDataList(mapId,mapDataList); //地图数据列表
            if ($('#js-ajs-sort').hasClass('fd-active')) {
				if($("#js-ajs-sort").find(".fd-arrow-down").hasClass("fd-sort-up")){
	               maxData = mapDataList[mapDataList.length-1].ajs;
	               minData = 0;
				}else{
				   maxData = mapDataList[0].ajs;
                   minData = 0;
				}
				if(mapId=="000000"){
					if(maxData < xinjiangGroup.ajs){
				       maxData=xinjiangGroup.ajs;
			        }
				}
				
			} else if ($('#js-tb-sort').hasClass('fd-active')) {
				var list=[];
				//添加判断排除同比中的--
				for(var i=0;i<mapDataList.length;i++){
                    var tb = mapDataList[i].tb;
                    if(tb!="--"&&tb!=""&&tb!=null){
                    	list.push(mapDataList[i]);
                    }
				}
				if($('#js-tb-sort').find(".fd-arrow-down").hasClass("fd-sort-up")){
					if(list[list.length-1].tb!="--"){
						maxData = parseFloat(list[list.length-1].tb);
					}else{
						maxData = list[list.length-1].tb;
					}
                    if(list[0].tb!="--"){
						minData = parseFloat(list[0].tb);
					}else{
						minData = list[0].tb;
					}

				}else{
					if(list[0].tb!="--"){
						maxData = parseFloat(list[0].tb);
					}else{
						maxData = list[0].tb;
					}
					if(list[list.length-1].tb!="--"){
						minData = parseFloat(list[list.length-1].tb);
					}else{
						minData = list[list.length-1].tb;
					}
				}
				if(mapId=="000000"){
					if(maxData < xinjiangGroup.tb){
				    maxData=xinjiangGroup.tb;
			       }
				}
			   
		}

        },
        errot:function(e){
        	alert(e);
        }
      });
        obj.maxValue =maxData;
        obj.minValue = minData;
		return obj;
    }
    function getRightList(){
            var obj;
            var url = globalUrl.areaMap(global.getMapid());
            var params = global.getLocalStoregeParam();
        	$.ajax({
         		type:'get',
         		data:{'param':JSON.stringify(params)},
         		url:url,
         		dataType : 'json',
			    async : false,
			    success:function(result){
                    obj = result.result.dataList;
                    $scope.rightList = obj;
                    $scope.$apply();
			    },
			    error:function(e){
			    	//console.log(e);
			    }
         	})
            return obj;
        }
    
    //  初始化页面
    (function () {
        var mapId = global.getMapid();
		if(mapId!='000000'){
			$(".js-dyfx-list-nav li").eq(1).addClass("fd-xxk-disable");
		}else{
			$(".js-dyfx-list-nav li").eq(1).removeClass("fd-xxk-disable");
		}
        global.saveLocalStorage("sffy",false);
        // 初次加载数据(jrdt-data.js  函数initStorage()中定义默认为全国)
        refreshPage(mapId, true);

        //  第一次记录previous  mapid 是什么
        global.saveLocalStorage('mapIdPrevious', global.findLocalStorage('mapId'));

        window.onmessage = function (evt) {
            var event = evt || window.event;
            var data = JSON.parse(event.data);
            if (data.message == "change") {
            	//判断选项卡，设置初始值
            	$(".js-dyfx-list-nav li").eq(0).trigger("click");
            	$("#js-tb-sort").find(".js-arrow").removeClass("fd-sort-up");
            	$("#js-ajs-sort").find(".js-arrow").removeClass("fd-sort-up");
            	$("#js-ajs-sort").addClass("fd-active").parent().siblings().find(".js-list-btn").removeClass("fd-active");
                global.saveLocalStorage("pxlx",0);
                global.saveLocalStorage("pxmc","ajs");
                //判断选项卡，设置初始值end
                var mapIdPrevious = global.findLocalStorage('mapIdPrevious');
                var mapIdNow = global.findLocalStorage('mapId');
                var initPage = (mapIdPrevious != mapIdNow);
                global.saveLocalStorage("sffy",false);
                refreshPage(mapIdNow, true);
                global.saveLocalStorage('mapIdPrevious', mapIdNow);
               // console.log('地域选择刷新' + mapIdNow);
                if(mapIdNow!='000000'){
                	$(".js-dyfx-list-nav li").eq(1).addClass("fd-xxk-disable");
                }else{
                	$(".js-dyfx-list-nav li").eq(1).removeClass("fd-xxk-disable");
                }
            }
        };
        //高院点击
    	$(".js-dyfx-list-nav").off("click.li").on("click.li","li",function(){
    		global.saveLocalStorage("sffy",false);
    		var _this = $(this);
    		if(_this.hasClass("fd-xxk-disable")){
    			return;
    		}
            var index = _this.index();
            global.saveLocalStorage("xxkjb",index+1);
    		if(_this.hasClass("fd-active")){
    			return;
    		}
    		_this.addClass("fd-active").siblings().removeClass("fd-active");
    	    //判断点击辖区的时候刷新地图
    		if(index==0){
    			var mapId = global.findLocalStorage("mapId");
    			refreshPage(mapId,true)
    		}else{
    			getRightList();
    		}
    		

    	});
    	//查看更多按钮的点击
        $(".js-list-all").click(function(){
        	var title="";
        	var ksqr = $(window.parent.document).find("#beginMonth").val();
        	var jsrq =$(window.parent.document).find("#endMonth").val();
        	var fyjc = global.findLocalStorage("fyjc");
        	var xq = $(".js-dyfx-list-nav").find(".fd-active a").text();
        	//设置列表页面需要的文字
        	var fyjb=global.findLocalStorage("fyjb");
        	var currentXxk = xq;
        	if(xq=="辖区"){
        		if(fyjb==1){
                    currentXxk = "高级人民法院"+xq;
        		}else if(fyjb==2){
                    currentXxk = "中级人民法院"+xq
        		}
        	}else{
        		currentXxk=xq;
        	}
        	//列表页面显示的文字
        	localStorage.setItem("currentXxk",currentXxk);
        	var ajlx = $(window.parent.document).find(".js-select-content-ajlx").text();
        	var spcx=$(window.parent.document).find(".js-select-content-spcx").text();
        	var type = $(window.parent.document).find(".js-fx-aside-ul").find(".fd-active").find(".fd-circle-text-01").text();
            title=ksqr+"至"+jsrq+fyjc+xq;
            if(spcx=="全部"){
               title+=ajlx;	
            }else{
            	title+=ajlx+spcx;
            }
            title+=type+"案件排名"
            global.saveLocalStorage("listTitle",title);
            window.open("../html/sftj-list.html");
        });
       
    })();
    
       //处理tb
        $scope.handleTb=function(tb){
        	var str = global.handleTb(tb);
            return str;
        }
        $scope.changeStyleUp=function(tb){
            if(tb>0){
            	return true;
            }else{
            	return false;
            }

        }
        $scope.changeStyleDown = function(tb){
			if(tb<0){
            	return true;
            }else{
            	return false;
            }

         }
        $scope.isXq=function(){
        	var index = $(".js-dyfx-list-nav").find(".fd-active").index();
        	if(index==0){
        		global.saveLocalStorage("isXq",0);
        		return true;
        	}else{
        		global.saveLocalStorage("isXq",1);
        		return false;
        	}
        }
        $scope.handleZb=function(zb){
            var str=zb+"%";
            return str;
        }
        $scope.fymcSubstring=function(fymc){
          var str=global.subAymc(fymc);
          return str;
        }
        $scope.fymcHover=function(event,target){
            var val = target.getAttribute("data");
            var pointX = parseFloat(event.pageX) + 8;
            var pointY = parseFloat(event.pageY) + 5;
            $('#jsFdHint').text(val).show().css({
              top : pointY,
              left : pointX
            })
        }
        $scope.hideFymc=function(){
          $('#jsFdHint').hide();
        }
 	})
  bootstrap.start();
 })