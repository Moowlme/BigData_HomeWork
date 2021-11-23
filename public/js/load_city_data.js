$(document).ready(function () {

	var getJsonData;

	$.ajax({
		type: "post",
		url: "/getJsonData",
		datatype: "json",
		crossDomain: true,
		beforeSend: function () {
			//显示正在加载数据
			$("#loading").text("数据加载中,请稍候......");
		},
		success: function (data, status) {
			$("#loading").text("");
			if (status == "success") {

				var jsondata = data;
				getJsonData = jsondata;
				setCityList(jsondata);

				//初始化
				var selectCityID = 0;
				var selectCityText = '湖北';


				load_city_jsfile(0, "湖北");

			} else {
				alert('error');
			}
		},
		error: function (err, status) {
			alert('loading data error');
		}
	});



	//load_city_jsfile(0, "湖北");

	//根据城市加载对应的城市js脚本
	function getJsByCity(cityName) {
		var js_src = "";
		switch (cityName) {
			case "天津":
				js_src = "../map/js/province/tianjin.js";
				break;
			case "北京":
				js_src = "../map/js/province/beijing.js";
				break;
			case "上海":
				js_src = "../map/js/province/shanghai.js";
				break;
			case "安徽":
				js_src = "../map/js/province/anhui.js";
				break;
			case "澳门":
				js_src = "../map/js/province/aomen.js";
				break;
			case "重庆":
				js_src = "../map/js/province/chongqing.js";
				break;
			case "福建":
				js_src = "../map/js/province/fujian.js";
				break;
			case "甘肃":
				js_src = "../map/js/province/gansu.js";
				break;
			case "广东":
				js_src = "../map/js/province/guangdong.js";
				break;
			case "广西":
				js_src = "../map/js/province/guangxi.js";
				break;
			case "贵州":
				js_src = "../map/js/province/guizhou.js";
				break;
			case "海南":
				js_src = "../map/js/province/hainan.js";
				break;
			case "河北":
				js_src = "../map/js/province/hebei.js";
				break;
			case "湖北":
				js_src = "../map/js/province/hubei.js";
				break;
			case "黑龙江":
				js_src = "../map/js/province/heilongjiang.js";
				break;
			case "河南":
				js_src = "../map/js/province/henan.js";
				break;
			case "湖南":
				js_src = "../map/js/province/hunan.js";
				break;
			case "江苏":
				js_src = "../map/js/province/jiangsu.js";
				break;
			case "江西":
				js_src = "../map/js/province/jiangxi.js";
				break;
			case "广西":
				js_src = "../map/js/province/guangxi.js";
				break;
			case "吉林":
				js_src = "../map/js/province/jilin.js";
				break;
			case "辽宁":
				js_src = "../map/js/province/liaoning.js";
				break;
			case "内蒙古":
				js_src = "../map/js/province/neimenggu.js";
				break;
			case "宁夏":
				js_src = "../map/js/province/ningxia.js";
				break;
			case "青海":
				js_src = "../map/js/province/qinghai.js";
				break;
			case "山东":
				js_src = "../map/js/province/shandong.js";
				break;
			case "山西":
				js_src = "../map/js/province/shanxi.js";
				break;
			case "陕西":
				js_src = "../map/js/province/shanxi1.js";
				break;
			case "四川":
				js_src = "../map/js/province/sichuan.js";
				break;
			case "台湾":
				js_src = "../map/js/province/taiwan.js";
				break;
			case "香港":
				js_src = "../map/js/province/xianggang.js";
				break;
			case "新疆":
				js_src = "../map/js/province/xinjiang.js";
				break;
			case "西藏":
				js_src = "../map/js/province/xizang.js";
				break;
			case "云南":
				js_src = "../map/js/province/yunnan.js";
				break;
			case "浙江":
				js_src = "../map/js/province/zhejiang.js";
				break;
			default:
				js_src = "../map/js/province/hubei.js";
		}

		return js_src;
	}

	//优化方法，动态加载
	function load_city_jsfile(selectCityID, selectCityText) {

		var js_src = getJsByCity(selectCityText);
		//动态加载js
		jQuery.getScript(js_src)
			.done(function () {
				//console.log("第一次加载");

				load_map_and_data(selectCityID, selectCityText, getJsonData);
			})
			.fail(function () {

			});
	}

	//获取城市列表加载到下拉菜单
	function setCityList(data) {
		var testData = data.areaTree;
		var chinacitylist = testData[0].children;

		var options = '';
		options += '<option>请选择</option>'
		for (var i = 0; i < chinacitylist.length; i++) {
			options += '<option value="' + i + '">' + chinacitylist[i].name + '</option>';

			$('#citylist').html(options);
		}
	}

	$('#citylist').change(function () {

		var selectCityID = $(this).val();
		var selectCityText = $('#citylist option:selected').text();

		$('#selected').text(selectCityText);

		if(selectCityText=='北京'){
			$('#selected').html(selectCityText+'接口数据异常，只有累计病例人数');
		}
		//$("#loading").text("数据加载中,请稍候......");

		if(selectCityText=='请选择'){
			return;
		}
		load_city_jsfile(selectCityID, selectCityText);

	});

	function load_map_and_data(selectCityID, selectCityText, loadJsonData) {

		var jsondata = loadJsonData;

		if (selectCityText == '天津' || selectCityText == '重庆') {
			var CityData = getDataList(selectCityID, jsondata);
			var CityToolTopData = getDetailsToolTipData(selectCityID, jsondata);
			loadCityEchartsByCity(CityData, CityToolTopData, selectCityText);
			return;
		}

		if (selectCityText == '上海' || selectCityText == '北京') {
			var CityData = getDataListByCityQu(selectCityID, jsondata);
			var CityToolTopData = getDetailsToolTipDataByCityQu(selectCityID, jsondata);

			loadCityEchartsByCity(CityData, CityToolTopData, selectCityText);
		} else {
			var CityData = getDataListByCityshi(selectCityID, jsondata);
			var CityToolTopData = getDetailsToolTipDataByCityshi(selectCityID, jsondata);
			loadCityEchartsByCity(CityData, CityToolTopData, selectCityText);
		}

		//				} else {
		//					alert('error');
		//				}
		//			},
		//			error: function(err, status) {
		//				alert('loading data error');
		//			}
		//		});
	}

	//*******************************************************
	//末尾什么都不加的有天津和重庆

	function getDataList(cityName, data) {

		var testData = data.areaTree;

		

		var ciryOfDistrict = testData[0].children[cityName].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();
			perDis.name = ciryOfDistrict[i].name;

			perDis.value = ciryOfDistrict[i].total.confirm - ciryOfDistrict[i].total.heal - ciryOfDistrict[i].total.dead;
			districtConfirmData.push(perDis);
		}

		//console.log(districtConfirmData);

		return districtConfirmData;
	}

	function getDetailsToolTipData(cityName, data) {

		var testData = data.areaTree;

		var ciryOfDistrict = testData[0].children[cityName].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();

			perDis.name = ciryOfDistrict[i].name;

			var _valuedata = [];


			var nowConfirm = new Object();
			nowConfirm.name = "在诊病例"
			nowConfirm.value = ciryOfDistrict[i].total.confirm - ciryOfDistrict[i].total.heal - ciryOfDistrict[i].total.dead;
			_valuedata.push(nowConfirm);



			var confirm = new Object();
			confirm.name = "累计确诊病例";
			confirm.value = ciryOfDistrict[i].total.confirm;
			_valuedata.push(confirm);

			var heal = new Object();
			heal.name = "治愈病例";
			heal.value = ciryOfDistrict[i].total.heal;
			_valuedata.push(heal);

			var dead = new Object();
			dead.name = "病亡病例";
			dead.value = ciryOfDistrict[i].total.dead;
			_valuedata.push(dead);

			perDis.value = _valuedata //ciryOfDistrict[i].total.confirm;
			districtConfirmData.push(perDis);
		}

		//console.log('测试');
		//console.log(districtConfirmData);

		return districtConfirmData;
	}

	//*******************************************************
	//末尾加区

	function getDataListByCityQu(cityName, data) {

		var testData = data.areaTree;

		//console.log(testData)

		var ciryOfDistrict = testData[0].children[cityName].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();
			if (ciryOfDistrict[i].name == "浦东") {
				perDis.name = ciryOfDistrict[i].name + '新区';
			} else {
				perDis.name = ciryOfDistrict[i].name + '区';
			}

			// console.log('-----')
			// console.log(ciryOfDistrict[i].total.confirm)
			// console.log(ciryOfDistrict[i].total.heal)
			// console.log(ciryOfDistrict[i].total.dead)
			perDis.value = ciryOfDistrict[i].total.confirm - ciryOfDistrict[i].total.heal - ciryOfDistrict[i].total.dead;
			districtConfirmData.push(perDis);
		}

		//console.log(districtConfirmData);

		return districtConfirmData;
	}

	function getDetailsToolTipDataByCityQu(cityName, data) {

		var testData = data.areaTree;

		var ciryOfDistrict = testData[0].children[cityName].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();

			if (ciryOfDistrict[i].name == "浦东") {
				perDis.name = ciryOfDistrict[i].name + '新区';
			} else {
				perDis.name = ciryOfDistrict[i].name + '区';
			}

			var _valuedata = [];

			if(cityName!=12){

			

			var nowConfirm = new Object();
			nowConfirm.name = "在诊病例"
			nowConfirm.value = ciryOfDistrict[i].total.confirm - ciryOfDistrict[i].total.heal - ciryOfDistrict[i].total.dead;
			_valuedata.push(nowConfirm);

		}

			var confirm = new Object();
			confirm.name = "累计确诊病例";
			confirm.value = ciryOfDistrict[i].total.confirm;
			_valuedata.push(confirm);

			var heal = new Object();
			heal.name = "治愈病例";
			heal.value = ciryOfDistrict[i].total.heal;
			_valuedata.push(heal);

			var dead = new Object();
			dead.name = "病亡病例";
			dead.value = ciryOfDistrict[i].total.dead;
			_valuedata.push(dead);

			perDis.value = _valuedata //ciryOfDistrict[i].total.confirm;
			districtConfirmData.push(perDis);
		}

		//console.log('测试');
		//console.log(districtConfirmData);

		return districtConfirmData;
	}

	//*******************************************************
	//末尾加市
	//动态获取城市及相关数据+区
	function getDataListByCityshi(cityName, data) {

		var testData = data.areaTree;

		var ciryOfDistrict = testData[0].children[cityName].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();

			perDis.name = ciryOfDistrict[i].name + '市';

			perDis.value = ciryOfDistrict[i].total.confirm - ciryOfDistrict[i].total.heal - ciryOfDistrict[i].total.dead;
			districtConfirmData.push(perDis);
		}

		//console.log(districtConfirmData);

		return districtConfirmData;
	}

	//动态获取城市及详细信息
	//区数据
	// {name:"北京",value:[{name:"文科",value:95},{name:"理科",value:82}]},
	//参数cityName为id数字
	function getDetailsToolTipDataByCityshi(cityName, data) {

		var testData = data.areaTree;

		var ciryOfDistrict = testData[0].children[cityName].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();

			perDis.name = ciryOfDistrict[i].name + '市';

			var _valuedata = [];

			if (ciryOfDistrict[i].name != '北京') {

				var nowConfirm = new Object();
				nowConfirm.name = "在诊病例"
				nowConfirm.value = ciryOfDistrict[i].total.confirm - ciryOfDistrict[i].total.heal - ciryOfDistrict[i].total.dead;
				_valuedata.push(nowConfirm);

			}

			var confirm = new Object();
			confirm.name = "累计确诊病例";
			confirm.value = ciryOfDistrict[i].total.confirm;
			_valuedata.push(confirm);

			var heal = new Object();
			heal.name = "治愈病例";
			heal.value = ciryOfDistrict[i].total.heal;
			_valuedata.push(heal);

			var dead = new Object();
			dead.name = "病亡病例";
			dead.value = ciryOfDistrict[i].total.dead;
			_valuedata.push(dead);

			perDis.value = _valuedata //ciryOfDistrict[i].total.confirm;
			districtConfirmData.push(perDis);
		}

		//console.log('测试');
		//console.log(districtConfirmData);

		return districtConfirmData;
	}

	//测试获取地级市数据
	//{name:"北京",value:177},
	function getCityDataTest(data) {
		var testData = data.areaTree;

		var ciryOfDistrict = testData[0].children[22].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();
			perDis.name = ciryOfDistrict[i].name;
			perDis.value = ciryOfDistrict[i].total.confirm;
			districtConfirmData.push(perDis);
		}

		//console.log(districtConfirmData);

		return districtConfirmData;
	}

	//区数据
	// {name:"北京",value:[{name:"文科",value:95},{name:"理科",value:82}]},
	function getCityToolTipDataTest(data) {
		var testData = data.areaTree;

		var ciryOfDistrict = testData[0].children[22].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();

			perDis.name = ciryOfDistrict[i].name;

			var _valuedata = [];

			if (ciryOfDistrict[i].name != '北京') {

				var nowConfirm = new Object();
				nowConfirm.name = "在诊病例"
				nowConfirm.value = ciryOfDistrict[i].total.confirm - ciryOfDistrict[i].total.heal - ciryOfDistrict[i].total.dead;
				_valuedata.push(nowConfirm);

			}

			var heal = new Object();
			heal.name = "治愈病例";
			heal.value = ciryOfDistrict[i].total.heal;
			_valuedata.push(heal);

			var dead = new Object();
			dead.name = "病亡病例";
			dead.value = ciryOfDistrict[i].total.dead;
			_valuedata.push(dead);

			perDis.value = _valuedata //ciryOfDistrict[i].total.confirm;
			districtConfirmData.push(perDis);
		}

		//		console.log('测试');
		//		console.log(districtConfirmData);

		return districtConfirmData;
	}

	//根据城市动态加载地图及数据
	//测试
	function loadCityEchartsByCity(data, toolTipData, cityName) {
		//
		var name_title = '' //"新型冠状病毒肺炎全国疫情趋势图"
		var subname = '' //'数据爬取自腾讯数据 '+' 最后更新时间 '
		var nameColor = " rgb(55, 75, 113)"
		var name_fontFamily = '等线'
		var subname_fontSize = 15
		var name_fontSize = 18
		var mapName = cityName

		var geoCoordMap = {};

		var dom = document.getElementById('tianjin_map_panel');
		var myChart = echarts.init(dom);

		/*获取地图数据*/
		myChart.showLoading();
		var mapFeatures = echarts.getMap(mapName).geoJson.features;
		myChart.hideLoading();

		//		console.log('加载地图：' + mapName);
		//		console.log(toolTipData);
		//		console.log(data);

		mapFeatures.forEach(function (v) {
			// 地区名称
			var name = v.properties.name;
			// 地区经纬度
			geoCoordMap[name] = v.properties.cp;

		});

		var max = 48,
			min = 9; // todo 
		var maxSize4Pin = 10,
			minSize4Pin = 2;

		//获取数据
		var convertData = function (data) {

			var res = [];
			for (var i = 0; i < data.length; i++) {
				var geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value),
					});
				}
			}
			//console.log('convertData');
			//console.log(res);
			return res;
		};
		option = {
			title: {
				text: name_title,
				subtext: subname,
				x: 'center',
				textStyle: {
					color: nameColor,
					fontFamily: name_fontFamily,
					fontSize: name_fontSize
				},
				subtextStyle: {
					fontSize: subname_fontSize,
					fontFamily: name_fontFamily
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: function (params) {
					if (typeof (params.value)[2] == "undefined") {
						var toolTiphtml = ''
						for (var i = 0; i < toolTipData.length; i++) {
							if (params.name == toolTipData[i].name) {
								toolTiphtml += toolTipData[i].name + ':<br>'
								for (var j = 0; j < toolTipData[i].value.length; j++) {
									toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
								}
							}
						}
						//						console.log(toolTiphtml)
						// console.log(convertData(data))
						return toolTiphtml;
					} else {
						var toolTiphtml = ''
						for (var i = 0; i < toolTipData.length; i++) {
							if (params.name == toolTipData[i].name) {
								toolTiphtml += toolTipData[i].name + ':<br>'
								for (var j = 0; j < toolTipData[i].value.length; j++) {
									toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
								}
							}
						}
						console.log(toolTiphtml)
						return toolTiphtml;
					}
				}
			},
			//右下角数值栏
			visualMap: {
				show: true,
				//min: 1,
				//max: 200,
				type: 'piecewise',
				splitNumber: 4,
				pieces: [{
					min: 1,
					max: 99,
					label: '1-99',
					text: '1-99'
				},
				{
					min: 100,
					max: 999,
					label: '10-999'
				},
				{
					min: 1000,
					max: 9999,
					label: '1000-9999'
				},
				{
					min: 10000,
					label: '>10000'
				}
				],
				itemWidth: 50,
				showLabel: true,
				orient: "horizontal",
				left: 'center',
				top: 'top',
				//text: ['10000', '1'], // 文本，默认为数值文本
				calculable: true,
				seriesIndex: [1],
				inRange: {
					color: ['#ffaa85', '#7f1818']
				}
			},
			geo: {
				show: true,
				map: mapName,
				label: {
					normal: {
						show: false
					},
					emphasis: {
						show: false,
					}
				},
				roam: false,
				itemStyle: {
					normal: {
						areaColor: '#ffffff',
						borderColor: '#3B5077',
					},
					emphasis: {
						areaColor: '#2B91B7',
					}
				}
			},
			//显示各个省市标记点
			series: [{
				name: '散点',
				type: 'scatter',
				coordinateSystem: 'geo',
				data: convertData(data),
				symbolSize: 5,
				label: {
					normal: {
						formatter: '{b}',
						position: 'right',
						show: true
					},
					emphasis: {
						show: true
					}
				},
				itemStyle: {
					normal: {
						color: '#000000'
					}
				}
			},
			{
				type: 'map',
				map: mapName,
				geoIndex: 0,
				aspectScale: 0.75, //长宽比
				showLegendSymbol: false, // 存在legend时显示
				label: {
					normal: {
						show: true
					},
					emphasis: {
						show: false,
						textStyle: {
							color: '#fff'
						}
					}
				},
				roam: true,
				itemStyle: {
					normal: {
						areaColor: '#031525',
						borderColor: '#3B5077',
					},
					emphasis: {
						areaColor: '#2B91B7'
					}
				},
				animation: false,
				data: data
			},
			{
				name: '点',
				type: 'scatter',
				coordinateSystem: 'geo',
				symbol: 'pin', //气泡
				symbolSize: 50,
				label: {
					normal: {
						formatter: '{@[2]}',
						show: true,
						textStyle: {
							color: '#fff',
							fontSize: 9,
						}
					}
				},
				itemStyle: {
					normal: {
						color: '#F62157', //标志颜色
					}
				},
				zlevel: 6,
				data: convertData(data),
			},
			]
		};
		myChart.setOption(option);
	}

	//测试
	function loadCityEcharts(data, toolTipData) {
		//
		var name_title = '' //"新型冠状病毒肺炎全国疫情趋势图"
		var subname = '' //'数据爬取自腾讯数据 '+' 最后更新时间 '
		var nameColor = " rgb(55, 75, 113)"
		var name_fontFamily = '等线'
		var subname_fontSize = 15
		var name_fontSize = 18
		var mapName = '天津'

		//console.log('初始化天津');

		var geoCoordMap = {};

		var dom = document.getElementById('tianjin_map_panel');
		var myChart = echarts.init(dom);

		/*获取地图数据*/
		myChart.showLoading();
		var mapFeatures = echarts.getMap(mapName).geoJson.features;
		myChart.hideLoading();

		//		console.log(mapName);
		//console.log(data);
		//console.log(toolTipData);

		mapFeatures.forEach(function (v) {
			// 地区名称
			var name = v.properties.name;
			// 地区经纬度
			geoCoordMap[name] = v.properties.cp;

		});

		var max = 48,
			min = 9; // todo 
		var maxSize4Pin = 10,
			minSize4Pin = 2;

		//获取数据
		var convertData = function (data) {
			var res = [];
			for (var i = 0; i < data.length; i++) {
				var geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value),
					});
				}
			}
			//console.log('convertData');
			//console.log(res);
			return res;
		};
		option = {
			title: {
				text: name_title,
				subtext: subname,
				x: 'center',
				textStyle: {
					color: nameColor,
					fontFamily: name_fontFamily,
					fontSize: name_fontSize
				},
				subtextStyle: {
					fontSize: subname_fontSize,
					fontFamily: name_fontFamily
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: function (params) {
					if (typeof (params.value)[2] == "undefined") {
						var toolTiphtml = ''
						for (var i = 0; i < toolTipData.length; i++) {
							if (params.name == toolTipData[i].name) {
								toolTiphtml += toolTipData[i].name + ':<br>'
								for (var j = 0; j < toolTipData[i].value.length; j++) {
									toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
								}
							}
						}
						console.log(toolTiphtml)
						// console.log(convertData(data))
						return toolTiphtml;
					} else {
						var toolTiphtml = ''
						for (var i = 0; i < toolTipData.length; i++) {
							if (params.name == toolTipData[i].name) {
								toolTiphtml += toolTipData[i].name + ':<br>'
								for (var j = 0; j < toolTipData[i].value.length; j++) {
									toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
								}
							}
						}
						console.log(toolTiphtml)
						return toolTiphtml;
					}
				}
			},
			//右下角数值栏
			visualMap: {
				show: true,
				min: 1,
				max: 200,
				left: 'left',
				top: 'bottom',
				text: ['高', '低'], // 文本，默认为数值文本
				calculable: true,
				seriesIndex: [1],
				inRange: {
					color: ['#ffaa85', '#7f1818']
				}
			},
			geo: {
				show: true,
				map: mapName,
				label: {
					normal: {
						show: false
					},
					emphasis: {
						show: false,
					}
				},
				roam: false,
				itemStyle: { //地图默认颜色
					normal: {
						areaColor: '#ffffff',
						borderColor: '#3B5077',
					},
					emphasis: {
						areaColor: '#2B91B7',
					}
				}
			},
			//显示各个省市标记点
			series: [{
				name: '散点',
				type: 'scatter',
				coordinateSystem: 'geo',
				data: convertData(data),
				symbolSize: 5,
				label: {
					normal: {
						formatter: '{b}',
						position: 'right',
						show: true
					},
					emphasis: {
						show: true
					}
				},
				itemStyle: {
					normal: {
						color: '#000000'
					}
				}
			},
			{
				type: 'map',
				map: mapName,
				geoIndex: 0,
				aspectScale: 0.75, //长宽比
				showLegendSymbol: false, // 存在legend时显示
				label: {
					normal: {
						show: true
					},
					emphasis: {
						show: false,
						textStyle: {
							color: '#fff'
						}
					}
				},
				roam: false,
				itemStyle: {
					normal: {
						areaColor: '#031525',
						borderColor: '#3B5077',
					},
					emphasis: {
						areaColor: '#2B91B7'
					}
				},
				animation: false,
				data: data
			},
			{
				name: '点',
				type: 'scatter',
				coordinateSystem: 'geo',
				symbol: 'pin', //气泡
				symbolSize: 50,
				label: {
					normal: {
						formatter: '{@[2]}',
						show: true,
						textStyle: {
							color: '#fff',
							fontSize: 9,
						}
					}
				},
				itemStyle: {
					normal: {
						color: '#F62157', //标志颜色
					}
				},
				zlevel: 6,
				data: convertData(data),
			},
			]
		};
		myChart.setOption(option);
	}

});