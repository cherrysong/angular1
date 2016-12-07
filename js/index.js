/**
 * version:	 		    1.0.0
 * creatTime: 	 		2016.08.04
 * updateTime: 			2016.08.04
 * author:				zhaoyaoyao
 * name:  				index.js
 **/
 define(['jquery','global','app','bootstrap','url','leftTree','wdatepicker'],function($,global,app,bootstrap,url){
 	app.controller('sftjController', function($scope) {
 	var obj={
 		 params:{
             mapId:'000000',
             ksrq:'201601',
             jsrq:'201607',
             ajlx:0,
             spcx:0,
             type:'xs'
 		 },
 		 //初始化
         init:function(){
            obj.initParams();
         	$("#iframe-main").attr('src','dyfx.html?params='+JSON.stringify(obj.params));
         	//angularjs输出案件类型和审判程序
         	    var url= "../json/ajlx.json";
         		  // var navData = obj.getNavData(url);
                   $scope.navData = obj.getNavData(url);
                   $scope.ajlx = $scope.navData.ajlx;
                   $scope.spcx = $scope.navData.ajlx[0].list;
                   $scope.getSpcxList = function(index){
                   	   $scope.spcx = $scope.navData.ajlx[index].list;
                   }
             
           //点击事件
           this.initEvent();
           //
           this.onmessage();
           //新收旧存已结未结数据
           //this.getCircleData();
           $(window.parent.document).find("#fd-treeMax-000000").removeClass("tree-hd-selected").trigger("click");

         },
         //把参数放到localStorage中
         initParams:function(){
            global.saveLocalStorage("mapId","000000");//法院id
           /* global.saveLocalStorage("ksrq","201601");//开始日期
            global.saveLocalStorage("jsrq","201601");//结束日期*/
            global.saveLocalStorage("ajlx","00");//案件类型
            global.saveLocalStorage("spcx","00");//审判程序
            global.saveLocalStorage("type","xs");//类型，新收、旧存、已结、未结
            global.saveLocalStorage("fyjb",1);//法院级别
            global.saveLocalStorage("pxmc","ajs");//排序名称tb和ajs
            global.saveLocalStorage("pxlx","0");//排序类型0降序，1升序
            global.saveLocalStorage("sffy",false);//是否分页，默认不分页
            global.saveLocalStorage("xxkjb",1);//选项卡级别，1辖区
         },
         //获取新收旧存已结未结数据
         getCircleData:function(){
            var params = global.getLocalStoregeParam();
            $.ajax({
            	type:'get',
            	data:{"param":JSON.stringify(params)},
            	url:url.circleData,
            	dataType:'json',
            	async : true,
            	success:function(result){
                    var jsonData = result.result;
                    $(".js-xs").text(jsonData.xs);
                    $(".js-yj").text(jsonData.yj);
                    $(".js-wj").text(jsonData.wj);
                    $(".js-jc").text(jsonData.jc);
                    $(".js-xstb").text(obj.handleTb(jsonData.xstb).data);
                    $(".js-xstb").parent().find(".fd-arrow-span").removeClass("fd-down").removeClass("fd-up").addClass(obj.handleTb(jsonData.xstb).cla);
                    $(".js-jctb").text(obj.handleTb(jsonData.jctb).data);
                    $(".js-jctb").parent().find(".fd-arrow-span").removeClass("fd-down").removeClass("fd-up").addClass(obj.handleTb(jsonData.jctb).cla);
                    $(".js-yjtb").text(obj.handleTb(jsonData.yjtb).data);
                    $(".js-yjtb").parent().find(".fd-arrow-span").removeClass("fd-down").removeClass("fd-up").addClass(obj.handleTb(jsonData.yjtb).cla);
                    $(".js-wjtb").text(obj.handleTb(jsonData.wjtb).data);
                    $(".js-wjtb").parent().find(".fd-arrow-span").removeClass("fd-down").removeClass("fd-up").addClass(obj.handleTb(jsonData.wjtb).cla);
                    var message = result.message;
                    $(".js-message").text();
                    if(message!="成功"){
                      $(".js-message").text(message);
                    } else{
                        $(".js-message").text("");
                    }
            	
              },
            	error:function(e){
            		alert(e);
            	}

            })
         },

         //接收postMessage的信息
         onmessage:function(){
            window.onmessage = function(event){
            	event = event||window.event;
            	var data = JSON.parse(event.data);
            	if(data.message=='refresh'){
            		var mapId = data.data.mapId;
                    var fyjb = data.data.fyjb;
                    var fyjc = data.data.fyjc;
            		global.saveLocalStorage("mapId",mapId);
                    global.saveLocalStorage("fyjb",fyjb);
                    global.saveLocalStorage("fyjc",fyjc);
            		obj.params.mapId = mapId;
                    obj.params.fyjb = fyjb;
                    obj.params.fyjc = fyjc;
                    obj.params.titleKsrq =$("#beginMonth").val();
                    obj.params.titleJsrq =$("#endMonth").val();
                    obj.params.titleFyjc=fyjc;
                    obj.params.titleAjlx = $(".js-select-content-ajlx").text();
                    var spcxText = $(".js-select-content-spcx").text();
                    if(spcxText=="全部"){
                        obj.params.titleSpcx = '';
                    }else{
                        obj.params.titleSpcx = spcxText;
                    }
                    obj.params.titleType = "新收";
                    $(".js-sftj-title").text(obj.params.titleKsrq+"至"+obj.params.titleJsrq+obj.params.titleFyjc+obj.params.titleAjlx+obj.params.titleSpcx+obj.params.titleType+"案件");
            		//获取数据
            		obj.getCircleData();
            		//向子窗口发送消息
            		obj.postMessage();
            	}
            }
         },
         //向子窗口发送消息
         postMessage:function(){
         	var message = {
         		message:"change",
         		data:obj.params
         	}
            $("#iframe-main")[0].contentWindow.postMessage(JSON.stringify(message),'*');
         },
         //初始化点击事件
         initEvent:function(){
	        //案件类型点击
	        $(".js-select-ajlx").on("click",function(){
	        	$(".js-select-list-ajlx").show();
	        })
	        $(".js-select-list-ajlx").on('click','dd',function(event){
		     	var _this=$(this);
		     	var ajlx = _this.data("ajlx");
                var text =_this.text();
                obj.params.titleAjlx = text;
                var spcxText = $(".js-select-content-spcx").text();
                if(spcxText==="全部"){
                   obj.params.titleSpcx=""
                  $(".js-sftj-title").text(obj.params.titleKsrq+"至"+obj.params.titleJsrq+obj.params.titleFyjc+obj.params.titleAjlx+obj.params.titleSpcx+obj.params.titleType+"案件");
                }else{
                   obj.params.titleSpcx=spcxText; 
                   $(".js-sftj-title").text(obj.params.titleKsrq+"至"+obj.params.titleJsrq+obj.params.titleFyjc+obj.params.titleAjlx+obj.params.titleSpcx+obj.params.titleType+"案件");
                }
                $scope.$apply();
                obj.params.ajlx = ajlx;
		     	global.saveLocalStorage("ajlx",ajlx);
		     	$(".js-select-content-ajlx").text(_this.text());
		     	$(".js-select-list-ajlx").hide();
		     	$(".js-select-list-spcx dd").eq(0).trigger('click');
          obj.getCircleData();
		     	obj.postMessage();
	        });
	         //审判程序点击
	        $(".js-select-spcx").on("click",function(){
	        	$(".js-select-list-spcx").show();
	        })
	        $(".js-select-list-spcx").on('click','dd',function(event){
    		     	var _this=$(this);
    		     	var spcx = _this.data("spcx");
                var text =_this.text();
                obj.params.titleSpcx = text;
                if(text=="全部"){
                  obj.params.titleSpcx="";
                }
                $(".js-sftj-title").text(obj.params.titleKsrq+"至"+obj.params.titleJsrq+obj.params.titleFyjc+obj.params.titleAjlx+obj.params.titleSpcx+obj.params.titleType+"案件");
		          	obj.params.spcx = spcx;
                global.saveLocalStorage("spcx",spcx);
      		     	$(".js-select-content-spcx").text(_this.text());
      		     	$(".js-select-list-spcx").hide();
                obj.getCircleData();
      		     	obj.postMessage();
	        });
	        //窗口的点击事件，点击隐藏下拉框
	        $(window).on("click",function(event){
	        	hideSelect(event);
	        })
	        //子窗口的点击
	        $(document.getElementById("iframe-main").contentWindow.document).on("click",function(event){
	        	hideSelect(event);
	        })
	        //隐藏下拉框
	        function hideSelect(event){
	        	var event = event||window.event;
	        	var target = $(event.target);
	        	if(target.hasClass("js-select-ajlx")||target.hasClass("js-select-content-ajlx")||
	        		target.hasClass("fd-sel-con-arrow")||target.hasClass("js-select-spcx")||target.hasClass("js-select-content-spcx")){

	        	}else{
	        		$(".js-select-list-ajlx").hide();
	        		$(".js-select-list-spcx").hide();
	        	}
	        }
         	//页签切换
         	$(".fd-page-btn .fd-page-btn-item ").click(function(){
                var _this = $(this);
                if(_this.hasClass("fd-btn-active")){
                	return;
                }
                var index = _this.index();
                _this.addClass("fd-btn-active").siblings().removeClass("fd-btn-active");
                if(index==1){
                	$("#iframe-main").attr('src','qsfx.html?params='+JSON.stringify(obj.params));
                }else{
                	$("#iframe-main").attr('src','dyfx.html?params='+JSON.stringify(obj.params));
                }
         	});
         	//左侧圆点击事件
            $(".js-fx-aside-ul").on("click","li",function(){
            	if($(this).hasClass("fd-active")){
            		return;
            	}
            	var type = $(this).attr("data");
                var text =$(this).find("h4").text();
                obj.params.titleType = text;
                $(".js-sftj-title").text(obj.params.titleKsrq+"至"+obj.params.titleJsrq+obj.params.titleFyjc+obj.params.titleAjlx+obj.params.titleSpcx+obj.params.titleType+"案件");
                obj.params.type=type;
                global.saveLocalStorage("type",type);
            	$(this).addClass("fd-active").siblings().removeClass("fd-active");
            	obj.postMessage();
            })
            //时间选择，添加时间的控制
            $("#endMonth").focus(function(){
            	WdatePicker({
                   dateFmt:'yyyy年MM月',
                   maxDate:obj.params.endYear,
                   minDate:'#F{$dp.$D(\'beginMonth\')}',
                   onpicking:function(dp){
                       handleEndTime(dp);
                   },
                   ychanged:function(dp){
                       handleEndTime(dp);
                    },
                    Mchanged:function(dp){
                      handleEndTime(dp);
                    },
                   });
            });
            function handleEndTime(dp){
               var year = $dp.cal.getNewP("y");
               var mon = $dp.cal.getNewP("M");
               var jsrq = year+mon;
               obj.params.titleJsrq = global.handleTime(jsrq);
               $(".js-sftj-title").text(obj.params.titleKsrq+"至"+obj.params.titleJsrq+obj.params.titleFyjc+obj.params.titleAjlx+obj.params.titleSpcx+obj.params.titleType+"案件");
               obj.params.jsrq = jsrq;
               global.saveLocalStorage("jsrq",jsrq);
               obj.getCircleData();
               obj.postMessage();
            }
            //添加时间的控制
            $("#beginMonth").focus(function(){
            	WdatePicker({
                    dateFmt:'yyyy年MM月',
                    minDate:'2013年01月',
                    maxDate:'%y年{%M-1}月',
                    ychanged:function(dp){
                	     handleTime(dp);
            	      },
                    Mchanged:function(dp){
                      handleTime(dp);
                    },
                    onpicking:function(dp){
                      handleTime(dp);
                    }

            });
            	
            })
            //开始时间的选择控制
            function handleTime(dp){
              var year = $dp.cal.getNewP("y");
                       var mon = $dp.cal.getNewP("M");
                       var ksrq = year+mon;
                       obj.params.ksrq = ksrq;
                       if(year<2016){//判断年小于2016
                          obj.params.endYear = '2015年12月';
                          $("#endMonth").val(year+"年12月");
                           global.saveLocalStorage("jsrq",year+'12');
                          var url2="../json/ajlx2.json";
                          var data = obj.getNavData(url2);
                          //设置标题的日期
                          obj.params.titleJsrq = global.handleTime(year+'12');
                          obj.params.titleKsrq = global.handleTime(ksrq);
                          $scope.navData = data;
                          $scope.ajlx=data.ajlx;
                          $scope.spcx=data.ajlx[0].list;
                          $scope.$apply();
                          //设置为全部
                          $(".js-select-content-ajlx").text("全部");
                           global.saveLocalStorage("ajlx","00");
                          $(".js-select-content-spcx") .text("全部");
                           global.saveLocalStorage("spcx","00");
                           //设置圆圈默认为新收
                           $(".js-fx-aside-ul li").eq(1).trigger("click");
                           obj.params.titleAjlx = "全部";
                          obj.params.titleSpcx = "";
                          $(".js-sftj-title").text(obj.params.titleKsrq+"至"+obj.params.titleJsrq+obj.params.titleFyjc+obj.params.titleAjlx+obj.params.titleSpcx+obj.params.titleType+"案件");
                         
                       }else{//判断年大于等于2016
                          var url2="../json/ajlx.json";
                          //从新获取十大类案件类型
                          var data = obj.getNavData(url2);
                          $scope.navData = data;
                          $scope.ajlx=data.ajlx;
                          $scope.spcx=data.ajlx[0].list;
                          $scope.$apply();
                          obj.params.endYear ="%y年{%M-1}月";
                          var myDate = new Date();
                          //上一个月
                          myDate = myDate.setMonth(myDate.getMonth()-1);
                          var lastDate = new Date(myDate);
                          var y = lastDate.getFullYear();
                          var m=lastDate.getMonth()+1;
                          if (parseInt(m)<10) {
                            m = "0"+m;
                          };
                          $("#endMonth").val(y+"年"+m+"月");
                          obj.params.titleKsrq = global.handleTime(ksrq);
                          obj.params.titleJsrq = y+"年"+m+"月";
                          global.saveLocalStorage("jsrq",y+m);
                          $(".js-select-content-ajlx").text("全部");
                           global.saveLocalStorage("ajlx","00");
                          $(".js-select-content-spcx") .text("全部");
                           global.saveLocalStorage("spcx","00");
                           //设置圆圈默认为新收
                           $(".js-fx-aside-ul li").eq(1).trigger("click");
                          obj.params.titleAjlx = "全部";
                          obj.params.titleSpcx = "";
                          $(".js-sftj-title").text(obj.params.titleKsrq+"至"+obj.params.titleJsrq+obj.params.titleFyjc+obj.params.titleAjlx+obj.params.titleSpcx+obj.params.titleType+"案件");
                       }
                       global.saveLocalStorage("ksrq",ksrq);
                       obj.getCircleData();
                       obj.postMessage();
            }
           
         },
         //获取下拉框数据
         getNavData:function(url){
         	var obj;
         	$.ajax({
         		type:'get',
         		data:null,
         		url:url,
         		dataType : 'json',
			    async : false,
			    success:function(result){
                    obj = result.result;
			    },
			    error:function(e){
			    	console.log(e);
			    	alert(e);
			    }
         	})
         	return obj;
         },
      //处理同比,修改数据为--是不显示上升下降箭头
         handleTb:function(tb){
         	var p={};
            var data = 0.00;
            if(tb!=null&&tb!=""&&tb!="--"){
              if(!isNaN(tb)){//数字
                  data=parseFloat(tb);
                }else{//字符串
                  data=tb.replace(",","");
                  data=parseFloat(tb);
                }
            }
            if(data<0){
                p.cla = 'fd-down';
                tb=tb+"";
                data = tb.replace("-", "") +"%";
            }else if(data>0){
                data = tb +"%";
                p.cla = 'fd-up';
            }else if(data == 0){
                data = "--";
                p.cla = '';
            }else if(data == null){
                data = "null";
                p.cla = '';
            }
            p.data = data;
            return p;
         }
 	};
 	//调用方法
 	obj.init();
 	return obj;
 	});
   bootstrap.start();//启动angularjs
 })