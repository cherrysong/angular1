/**
 * Created by zhaoyy on 2016/6/23.
 */
define(['global','echarts'],function(global){
	createBarCharts={
		drawBarCharts:function(corlor,xName,data,dom,callback){
			var myChart = echarts.init(document.getElementById(dom));
	        var option = {
	            grid:{
	                    borderWidth:'0' ,//网格边框，设置右边白线消失 
	                    x:60,
	                    y:30,
	                    x2:40,
	                    y2:50,
	                    backgroundColor:'#fff'
	            },
	            xAxis : [
	                {
	                    splitLine : {
	                        show : false//是否显示网格线，默认显示
	                                },
	                    type : 'category',
	                    axisLine:{
	                        lineStyle:{//设置网格线的样式
	                            color:'#d1e8ff',
	                             width: 1
	                        }
	                    },
	                    axisLabel:{
	                      textStyle:{
	                          color:'#333'
	                      }
	                    },
	                    data : xName
	                                                                                                                       
	                }
	            ],
	            yAxis : [
	                {
	                     type : 'value',
	                     /*max:130,*/
	                    // splitNumber:3,//分割的段数
	                     splitLine : {
	                                show : true, // 是否显示网格线，默认显示
	                                lineStyle:{
	                                    color : '#d1e8ff'
	                                }
	                            },
	                     axisLine:{
	                        lineStyle:{
	                            color:'#d1e8ff',
	                            width: 1
	                        }
	                    },
	                    axisLabel:{
	                            formatter: '{value}',
	                            textStyle:{
	                                color:'#333'
	                            }
	                        }
	                }
	            ],
	            series : [
	                {
	                   itemStyle:{
		                  normal:{
		                    color:corlor,
		                    label:{
			                    show:true,
			                    position:'top',
			                    formatter: '{c}',
			                    textStyle:{
			                    	color:'#333'
			                    }
		                    }
	
		                  }
		                  
	                   },
	                    barWidth:'30',
	                    name:'',
	                    type:'bar',
	                    //symbol:'images/1.jpg',设置图例的图片
	                    //symbolSize:12,设置图例图片的大小
	                    data:data
	                }
	            ]
	        };
	        myChart.setOption(option);
	        myChart.on('click', function (param){
				var value=param.value;
				//x轴的值，即月份
				var name=param.name;
				callback(value,name);
			});
	        $(window).resize(function() {
				myChart.resize();
			});
		},
		// 画折线图
		drawLine: function(xAxisData,data,dom,mon,col) {
			var myChart = echarts.init(document.getElementById(dom));
			var style_time="width:100%;height:100%;text-align:center;padding:2px;";
            var style_value="width:100%;height:100%;text-align:center;padding:2px;";
			var colorList = [ "#cc99cc", "#b3a2c7", "#d39897", "#e3c1a3", "#ffff00" ];
			var length=null;
			var option = {
				tooltip:{
                    trigger : 'axis',
                    showDelay: 0,
                   formatter: function (params,ticket,callback) {
                   	//修改悬浮窗里显示的内容
	                var res = '<div style="'+style_time+'">' + global.handleTime(mon[params[0].dataIndex])+'</div><div style="'+style_value+'">';
	                length=params.length;
	                for (var i = 0, l = params.length; i < l; i++) {
	                    res +='案件 : ' + params[i].value+'<br/>';
	                }
	                res+="</div>";
	                setTimeout(function (){
	                    // 仅为了模拟异步回调
	                    callback(ticket, res);
	                }, 1000);
	                return res;
	            }
				},
				grid : {
					borderWidth : '0',// 网格边框，设置右边白线消失
					x : 60,
					y : 30,
					x2 : 40,
					y2 : 50,
					backgroundColor:'#fff'//设置直角坐标背景颜色
				},
				
				xAxis : [ {
					boundaryGap:'false',
					splitLine : {
						show : false
					// 是否显示网格线，默认显示
					},
					type : 'category',
					axisLine : {
						lineStyle : {// 设置网格线的样式
							color : '#d1e8ff',
							width : 1
						}
					},
					axisTick:{
                       show:true,
                       interval:2
					},
					axisLabel : {
						interval:function(index,data){
                          if(xAxisData.length<=12){//判断长度小于等于12，全部显示
                          	return true;
                          }else if(xAxisData.length>12&&xAxisData.length<=24){
                          	if(index%2!=0){
                          		return false;
                          	}else{
                          		return true;
                          	}
                          }else{
                          	if(index%3!=0){
                          		return false;
                          	}else{
                          		return true;
                          	}
                          }
                          
						},
						textStyle : {
							color : '#333'
						}
					},
					data : xAxisData
				
				} ],
				yAxis : [ {
					type : 'value',
					// splitNumber:3,//分割的段数
					splitLine : {
						show : true, // 是否显示网格线，默认显示
						lineStyle : {
							color : '#d1e8ff'
						}
					},
					axisLine : {
						lineStyle : {
							color : '#d1e8ff',
							width : 1
						}
					},
					axisLabel : {
						formatter : '{value}',
						textStyle : {
							color : '#333'
						}
					}
				} ],
				series : [
				    {
				    symbolSize:[5,5],
				    /*showAllSymbol:true,*///显示所有的点
                    name : '',
					type : 'line',
					smooth : 'none',
					itemStyle : {
						normal : {
							color:col,
							label : {
								show : false,//隐藏点上的数字
								formatter : '{c}',
								position : 'top',
								textStyle : {
									fontSize : '12',
									color:'#333'
								}
							}

						}
					},
					data : data
				 }
				]
			};
			myChart.setOption(option);
			myChart.on('click', function (param){
					var value=param.value;
					//x轴的值，即月份
					var name=param.name;
					
			});
	        $(window).resize(function() {
				myChart.resize();
			});
		}
	};
	return createBarCharts;
});