/**
* version:	 		    2015.01.01
* creatTime: 	 		2015.12.14
* author:				tangqian
* name:  				url
**/

define([], function() {
	//存储所有的url
	var urlStr={
			//本地json数据文件路径
			json:{
				circleData:'../json/circleData.json',
				areaMap:function(mapId){
					return '../json/mapid-' + mapId + '.json';
				},//地图数据
				tree:'../json/tree.json',//组织机构树json
				searchTree:'../json/search.json',//组织机构树查询
				qsfxData:'../json/qsfx.json',//趋势分析页面json
				qsfxList:'../json/qsfxList.json',//趋势分析排序
				listAll:'../json/listAll.json'
                
			},
			//web logic路径
			logic:{
                circleData:'../../ajztLogic.do?action=getAjzt',//新收旧存数据
				areaMap:function(mapId){
					return '../../fypm.do';
				},//地图页面的数据
				tree:'../../ajztLogic.do?action=initQueryConditionLogic',//目录树
				searchTree:'../../ajztLogic.do?action=getQueryData',
				qsfxData:'../../trendAnalysisLogic.do?action=getAnalysis',//趋势分析所有所有数据
				qsfxList:'../../trendAnalysisLogic.do?action=getQsfxPx',//趋势分析排序
                downLoad:'../../downloadExcel.do',//下载
                listAll:'../../fypm.do'
			}
	};
//	var url=urlStr.logic;
 	var url=urlStr.json;
	return url;
});