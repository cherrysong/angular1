/**
 * version:	 		    1.0.0
 * creatTime: 	 		2016.08.16
 * updateTime: 			2016.08.16
 * author:				zhaoyaoyao
 * name:  				sftj-list.js
 **/
 define(['jquery','global','url','app','bootstrap','jqueryPage'],function($,global,url,app,bootstrap,jqueryPage){
 	app.controller("sftjListCtrl",function($scope){
        $scope.handleTb=function(tb){
            var str = global.handleTb(tb);
          return str;
        };
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
        $scope.isXq=function(){
          var status = global.findLocalStorage("isXq");
          if(status=="0"){
            return true;
          }else{
            return false;
          }
        }
        $scope.handleZb=function(zb){
           var str=zb+"%";
           return str;
        }
        var listObj = {
     		params:{
                pageSize:30,
                pageNo:1,
                totalCount:""
            },
            init:function(){
              $(".fd-list-title span").text(global.findLocalStorage("listTitle"));
               global.saveLocalStorage("pxlx",0);
               global.saveLocalStorage("pxmc",'AJS');
               global.saveLocalStorage("sffy",true);//是否分页，默认不分页
               //获取数据
               listObj.initData(1);
               //分页的事件
                $(".tcdPageCode").createPage({
                    pageCount:listObj.params.pageCount,
                    current:1,
                    backFn:function(p){//点击页数执行
                        listObj.params.pageNo = p;
                        listObj.initData();
                        $scope.$apply();
                    }
                });
               listObj.initEvent();
               var currentXxk=localStorage.getItem("currentXxk");
               $(".js-xq-name").text(currentXxk);
            },
            //获取数据
            initData:function(type){
                var obj;
                var params = global.getLocalStoregeParam();
                params.pageNo = listObj.params.pageNo;
                params.pageSize = listObj.params.pageSize;
                params.title=global.findLocalStorage("listTitle");
                $("#pageNo").val(params.pageNo);
                $("#pageSize").val(params.pageSize);
                $("#mapId").val(params.mapId);
                $("#ajlx").val(params.ajlx);
                $("#spcx").val(params.spcx);
                $("#type").val(params.type);
                $("#ksrq").val(params.ksrq);
                $("#jsrq").val(params.jsrq);
                $("#pxlx").val(params.pxlx);
                $("#pxmc").val(params.pxmc);
                $("#fyjb").val(params.fyjb);
                $("#xxkjb").val(params.xxkjb);
                $("#sffy").val(params.sffy);
                $("#title").val(params.title);
                $.ajax({
                    type:'get',
                    data:{'param':JSON.stringify(params)},
                    url:url.listAll,
                    dataType : 'json',
                    async : false,
                    success:function(result){
                        obj = result.result;
                        var list1=[],list2=[],list3=[];
                        var str1="",str2="",str3="";
                        var listSize=obj.dataList.length;
                            for(var i=0;i<listSize;i++){
                                var data = obj.dataList[i];
                                if(i<10){
                                    list1.push(data);
                                }else if(i>=10&&i<20){
                                    list2.push(data);
                                }else if(i>=20){
                                   list3.push(data); 
                                }
                               
                            }
                        $scope.list1 = list1;
                        $scope.list2 = list2;
                        $scope.list3 = list3;
                        $scope.index = (listObj.params.pageNo-1)*listObj.params.pageSize+1;
                        var total = obj.fyzs;
                        $scope.total = total;
                        $scope.pageSize = listSize;
                        $scope.pageNumEnd = (listObj.params.pageNo-1)*listObj.params.pageSize+listSize;
                        //$scope.$apply();
                        if(type==1){//type==1执行分页数据的更新
                            listObj.initPage(total);
                        }
                        
                         
                    },
                    error:function(e){
                        console.log(e);
                    }
                })
                return obj;
            },
            //设置分页的数据
            initPage:function(total){
                var totalCount=total;//总数
                if(totalCount %listObj.params.pageSize == 0){
                    listObj.params.pageCount=parseInt(totalCount / listObj.params.pageSize);
                 }else{
                    listObj.params.pageCount=parseInt(totalCount / listObj.params.pageSize+1);
                 }
                 listObj.params.pageList = listObj.getPageList();
                 $scope.pageList=listObj.params.pageList;
                 /*$scope.$apply();*/
            },
            //获取页码的list
            getPageList:function(){
                var p = listObj.params.pageCount;
                var list=[];
                for(var i=1;i<=p;i++){
                    list.push(i);
                }
                return list;
            },
            initEvent:function(){
            	//排序按钮的点击事件
                $(".js-list-btn").on("click",function(){
                    var _this = $(this);
                    var mc = _this.attr("data-name");
                    var sortId=_this.attr("data");
                    listObj.params.pxlx = sortId;
                    global.saveLocalStorage('pxlx',sortId);
                    global.saveLocalStorage('pxmc',mc);
                        //改变data的值控制升序降序
                        //有选中样式并且排序id==0
                        if(sortId == '0'&&_this.hasClass("fd-active")){//0 降序，1升序
                            _this.attr("data",1);
                            _this.find(".js-arrow").addClass("fd-sort-up");
                            listObj.params.pxlx = 1;
                            global.saveLocalStorage('pxlx',1);
                            //从新获取数据
                            //listObj.initData();
                            if($(".tcdNumber").length>0){//判断页码是否存在
                                if($(".tcdNumber").eq(0).hasClass("fd-active")){
                                   listObj.initData(2);
                                   $scope.$apply();
                                   
                               }else{
                                 $(".tcdNumber").eq(0).trigger("click");
                               }
                            }else{//不存在重新获取数据
                                listObj.initData(2);
                                $scope.$apply();
                            }

                           
                        }else if(sortId =='1'&&_this.hasClass("fd-active")){//降序
                           _this.attr("data",0); 
                           _this.find(".js-arrow").removeClass("fd-sort-up");
                           listObj.params.pxlx = 0;
                           global.saveLocalStorage('pxlx',0);
                           //从新获取数据
                           //listObj.initData();
                           //listObj.initData();
                            if($(".tcdNumber").length>0){//判断页码是否存在
                                if($(".tcdNumber").eq(0).hasClass("fd-active")){
                                   listObj.initData(2);
                                   $scope.$apply();
                               }else{
                                 $(".tcdNumber").eq(0).trigger("click");
                               }
                            }else{//不存在重新获取数据
                                listObj.initData(2);
                                $scope.$apply();
                            }
                        }else if((sortId==''||sortId=="undefined")&&!_this.hasClass("fd-active")){
                            listObj.params.pxlx = 0;
                            global.saveLocalStorage('pxlx',0);
                           _this.attr("data",0); 
                           //从新获取数据
                           //listObj.initData();
                           //listObj.initData();
                            if($(".tcdNumber").length>0){//判断页码是否存在
                                if($(".tcdNumber").eq(0).hasClass("fd-active")){
                                   listObj.initData(2);
                                   $scope.$apply();
                               }else{
                                 $(".tcdNumber").eq(0).trigger("click");
                               }
                            }else{//不存在重新获取数据
                                listObj.initData(2);
                                $scope.$apply();
                            }
                           
                        }else{
                            //listObj.initData();
                            if($(".tcdNumber").length>0){//判断页码是否存在
                                if($(".tcdNumber").eq(0).hasClass("fd-active")){
                                   listObj.initData(2);
                                   $scope.$apply();
                               }else{
                                 $(".tcdNumber").eq(0).trigger("click");
                               }
                            }else{//不存在重新获取数据
                                listObj.initData(2);
                                $scope.$apply();
                            }
                        }
                    if(_this.hasClass("fd-active")){
                        return;
                    }else{
                        _this.addClass("fd-active").siblings().removeClass("fd-active");
                        
                    }
                })
               //下载按钮的点击
               $(".js-dowmload").click(function(){
                //修改参数
                  $("#sffy").val(false);
                  $("#js-form").attr("action",global.getLocalPath()+"downloadExcel.do");
                  $("#js-form").submit();
               })
     	    }
        }
     	listObj.init();
        return listObj;
            
        })
  bootstrap.start();
 })