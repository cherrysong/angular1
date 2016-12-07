/**
 * version:	 		    1.0.0
 * creatTime: 	 		2016.08.11
 * updateTime: 			2016.08.11
 * author:				zhaoyaoyao
 * name:  				qsfx.js
 **/
 define(['jquery','global','sftjksh-charts','app','bootstrap','url'],function($,global,sftjkshCharts,app,bootstrap,url){
 	app.controller('qsfxController', function($scope) {
        var qsfxObj = {
     		params:{
               mapId:'000000',
               ksrq:'201601',
               jsrq:'201607',
               ajlx:0,
               spcx:0,
               type:'xs',
               pxmc:'TB',
               pxlx:0,//0是降序，1是升序

     		},
            init:function(){
               global.saveLocalStorage("pxlx",0);
               global.saveLocalStorage("pxmc",'AJS');
               global.saveLocalStorage("sffy",false);//是否分页，默认不分页
               global.saveLocalStorage("xxkjb",1);//选项卡级别，1辖区
               //获取数据
               qsfxObj.onmessage();
               qsfxObj.initEvent();
               qsfxObj.getData();
               //qsfxObj.getRightList();
            },
            //获取数据
            getData:function(){
                var params = global.getLocalStoregeParam();
                $.ajax({
                    type:'get',
                    data:{'param':JSON.stringify(params)},
                    url:url.qsfxData,
                    dataType : 'json',
                    async : false,
                    success:function(result){
                        obj = result.result;
                       // $(window.parent.document).find(".js-sftj-title").text(obj.title);
                        var mon = obj.qsfx.time;
                        var data = obj.qsfx.value;
                        var mon2 = qsfxObj.handleMonth(mon);

                        var col ="#FF6600";
                        if(params.type=="jc"){
                            col ="#0079DF";
                        }else if(params.type=="yj"){
                            col ="#339933";
                        }else if(params.type=="wj"){
                            col ="#C4A91B";
                        }
                        sftjkshCharts.drawLine(mon2,data,'js-qst',mon,col);//多传一个参数显示框中用
                        var tbList = obj.tb.tbList;
                        var tbXname =[],tbData=[];
                        for(var i=0;i<tbList.length;i++){
                            tbXname.push(tbList[i].time);
                            tbData.push(tbList[i].ajs);
                        }
                        //调用画图的方法
                        sftjkshCharts.drawBarCharts(col,tbXname,tbData,'js-tb',null);
                        $scope.ajlxList = obj.ajlxList;
                        $scope.ajlxType=obj.ajlx;
                        $scope.spcxType=obj.spcx;
                    },
                    error:function(e){
                        alert(e);
                    }
                })
            },
            //获取案件类型list
            getRightList:function(){
                var params=global.getLocalStoregeParam();
                $.ajax({
                    type:'get',
                    data:{'param':JSON.stringify(params)},
                    url:url.qsfxList,
                    dataType : 'json',
                    async : true,
                    success:function(result){
                        var jsonData = result.result
                        $scope.ajlxList = jsonData.ajlxList;
                        $scope.ajlxType=jsonData.ajlx;
                        $scope.spcxType=jsonData.spcx;
                        $scope.$apply();
                    },
                    error:function(e){
                        console.log(e);
                        alert(e);
                    }
                })
            } ,
            handleMonth:function(mon){
                var mon = mon;
                var time=[];
                var y1 = mon[0].substring(0,4);
                var y2="",index=[];
              //改变第一个年份
                time.push(y1+"年");
                //拿到不同年份1月的index值
                for(var j=0;j<mon.length;j++){
                  y2 = mon[j].substring(0,4);
                  if(y1!=y2){
                    y1=y2;
                    index.push(j);
                  }
                }
                //循环处理两位数月份
                for(var i=1;i<mon.length;i++){
                  var m=mon[i].substring(4,6);
                  time[i] = m+"月";
                }
                //根据index数组中记录的数组下标处理格式为yyyy年
                for(var k=0;k<index.length;k++){
                  time[index[k]]=y2+"年";
                }
                
                return time;

            },
            //获取父窗口的消息
            onmessage:function(){
            	window.onmessage = function(event){
            		event = event||window.event;
            		var data = JSON.parse(event.data);
            		if(data.message=="refresh"){
                       qsfxObj.params.mapId = data.data.mapId;
            		}else if(data.message=="change"){
                       qsfxObj.params = $.extend(true, this.params, data.data);
                       qsfxObj.getData();
                       $scope.$apply();
                    }
            	}
            },
            //初始化事件
            initEvent:function(){
            	//排序按钮的点击事件
            	$(".js-list-btn").on("click",function(){
            		var _this = $(this);
                    var mc = _this.attr("data-name");
                    qsfxObj.params.pxmc = mc;
                    var sortId=_this.attr("data");
                    qsfxObj.params.pxlx = sortId;
                    global.saveLocalStorage('pxlx',sortId);
                    global.saveLocalStorage('pxmc',mc);
                        //改变data的值控制升序降序
                        if(sortId == '0'&&_this.hasClass("fd-active")){//0 降序，1升序
                            _this.attr("data",1);
                            _this.find(".js-arrow").addClass("fd-sort-up");
                            qsfxObj.params.pxlx = 1;
                            global.saveLocalStorage('pxlx',1);
                            //从新获取数据
                            qsfxObj.getRightList();
                        }else if(sortId =='1'&&_this.hasClass("fd-active")){//降序
                           _this.attr("data",0); 
                           _this.find(".js-arrow").removeClass("fd-sort-up");
                           qsfxObj.params.pxlx = 0;
                           global.saveLocalStorage('pxlx',0);
                           //从新获取数据
                           qsfxObj.getRightList();
                        }else if(sortId==''||sortId=="undefined"){
                            qsfxObj.params.pxlx = 0;
                            global.saveLocalStorage('pxlx',0);
                           _this.attr("data",0); 
                           //从新获取数据
                           qsfxObj.getRightList();
                        }
            		if(_this.hasClass("fd-active")){
                        return;
            		}else{
            			_this.addClass("fd-active").parent().siblings().find(".js-list-btn").removeClass("fd-active");
            		    
                    }
            	})
            }  

     	};
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
        $scope.changeStyleDown=function(tb){
            if(tb<0){
                return true;
            }else{
                return false;
            }
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
        $scope.isTrActive=function(type){
             if($scope.ajlxType==""){
              var spcx=$scope.spcxType;
                if((parseInt(spcx)==parseInt(type))&&parseInt(spcx)!=0){
                  return true;
                }else{
                  return false;
                }
             }else{
              var ajlx=$scope.ajlxType;
                if((parseInt(ajlx)==parseInt(type))&&parseInt(ajlx)!=0){
                  return true;
                }else{
                  return false;
                }
             }
        }
     	qsfxObj.init();
        return qsfxObj;
    });
    bootstrap.start();
})