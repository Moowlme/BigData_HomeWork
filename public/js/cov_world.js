$(document).ready(function () {

	$.ajax({
		type: "post",
		url: "/getJsonData",
		datatype: "json",
		crossDomain: true,
		success: function (data, status) {
			if (status == "success") {
				var jsData = data;

				$(".updatetime").text('更新时间：' + getlastUpdateTime(jsData));

			} else {
				alert('error');
			}
		},
		error: function (err, status) {
			alert('loading data error');
		}
	});



	$.ajax({
		type: "post",
		url: "/getJsonforeign",
		datatype: "json",
		crossDomain: true,
		success: function (data, status) {
			if (status == "success") {

				//var jsondata = JSON.parse(data);
				var jsData = data;
				//console.log(data);
				//alert('ok');

				console.log(jsData)
				//加载世界地图
				loadEcharts(getCountryList(jsData));

			} else {
				alert('error');
			}
		},
		error: function (err, status) {
			alert('loading data error');
		}
	});

	function getlastUpdateTime(data) {
		return data.lastUpdateTime;
	}

	function getChinaTotleData() {
		$.ajax({
			type: "post",
			url: "/getJsonData",
			datatype: "json",
			crossDomain: true,
			success: function (data, status) {
				if (status == "success") {
					var jsData = data;

					return jsData;

				} else {
					alert('error');
				}
			},
			error: function (err, status) {
				alert('loading data error');
			}
		});
	}

	//各个国家数据列表
	function getCountryList(data) {
		var getData = data.foreign.foreignList;

		var countryData = new Object();

		var countryconfirmtotoaldata = [];
		var countrydetailsdata = [];

		for (i = 0; i < getData.length; i++) {
			var countryconfirm = new Object();
			var countrydetails = new Object();

			countryconfirm.name = getData[i].name;
			countryconfirm.value = getData[i].confirm;
			countryconfirmtotoaldata.push(countryconfirm);

			//详细数据
			var country = new Object();
			country.name = getData[i].name;
			country.updatetime = getData[i].date;
			country.value = [];

			var confirm = new Object;
			confirm.name = "在诊病例";
			confirm.value = getData[i].confirm - getData[i].heal - getData[i].dead;
			country.value.push(confirm);

			var confirmtotle = new Object;
			confirmtotle.name = "累计确诊病例";
			confirmtotle.value = getData[i].confirm;
			country.value.push(confirmtotle);

			var heal = new Object;
			heal.name = "已治愈";
			heal.value = getData[i].heal;
			country.value.push(heal);

			var dead = new Object;
			dead.name = "病亡病例";
			dead.value = getData[i].dead;
			country.value.push(dead);

			countrydetailsdata.push(country);
		}

		//addchina


		var getChinaData = data.china.chinaTotal;

		var countryconfirm = new Object();
		countryconfirm.name = '中国';
		countryconfirm.value = getChinaData.nowConfirm;
		countryconfirmtotoaldata.push(countryconfirm);
		// //详细数据
		var country = new Object();
		country.name = '中国';
		country.updatetime = data.china.lastUpdateTime;
		country.value = [];

		var confirm = new Object;
		confirm.name = "在诊病例";
		confirm.value = getChinaData.nowConfirm;
		country.value.push(confirm);

		var confirmtotle = new Object;
		confirmtotle.name = "累计确诊病例";
		confirmtotle.value = getChinaData.confirm;
		country.value.push(confirmtotle);

		var heal = new Object;
		heal.name = "已治愈";
		heal.value = getChinaData.heal;
		country.value.push(heal);

		var dead = new Object;
		dead.name = "病亡病例";
		dead.value = getChinaData.dead;
		country.value.push(dead);
		countrydetailsdata.push(country);

		countryData.countryconfirmtotoaldata = countryconfirmtotoaldata;
		countryData.countrydetailsdata = countrydetailsdata;

		return countryData;
	}

	//其他国家疫情数据
	//要两个数组
	function otherCountryData(data) {
		var firstconvertdata = data.foreignList;

		console.log(firstconvertdata);

		var countrydata = new Object();
		var countrylist = [];
		var countrydatalist = [];
		var othercountrydetailsdata = [];

		//for(i = 0; i < firstconvertdata.length; i++) {
		for (i = 0; i < 10; i++) {
			if (firstconvertdata[i].name != '中国') {
				countrylist.push(firstconvertdata[i].name);
				countrydatalist.push(firstconvertdata[i].confirm);

				//第二组数据
				var city = new Object();
				city.name = firstconvertdata[i].name;
				city.value = [];

				var confirm = new Object;
				confirm.name = "确诊病例";
				confirm.value = firstconvertdata[i].confirm;
				city.value.push(confirm);

				var heal = new Object;
				heal.name = "治愈病例";
				heal.value = firstconvertdata[i].heal;
				city.value.push(heal);

				var dead = new Object;
				dead.name = "病亡病例";
				dead.value = firstconvertdata[i].dead;
				city.value.push(dead);
				//
				othercountrydetailsdata.push(city);
			}
		}

		countrydata.countrylist = countrylist;
		countrydata.countrydatalist = countrydatalist;
		countrydata.othercountrydetailsdata = othercountrydetailsdata;

		//每个国家详细数据

		//		console.log(countrydata);
		return countrydata;
	}

	//世界
	function loadEcharts(countryData) {

		var data = countryData.countryconfirmtotoaldata;

		var toolTipData = countryData.countrydetailsdata;

		//console.log(countryData);

		//
		var name_title = '' //"新型冠状病毒肺炎全球疫情趋势图"
		var subname = '' //'数据爬取自腾讯接口数据 ' //+ ' 最后更新时间 ' + lastUpdateTime
		var nameColor = " rgb(55, 75, 113)"
		var name_fontFamily = '等线'
		var subname_fontSize = 15
		var name_fontSize = 18
		var mapName = 'world'

		var geoCoordMap = {};

		var dom = document.getElementById('chartmap-panel');
		var myChart = echarts.init(dom);

		/*获取地图数据*/
		myChart.showLoading();
		var mapFeatures = echarts.getMap(mapName).geoJson.features;
		myChart.hideLoading();
		mapFeatures.forEach(function (v) {
			// 地区名称
			var name = v.properties.name;

			// 地区经纬度
			//geoCoordMap[name] = v.properties.cp;

		});

		//console.log(data)

		var max = 48,
			min = 9; // todo 
		var maxSize4Pin = 10,
			minSize4Pin = 2;

		//获取数据
		var convertData = function (data) {
			var res = [];
			//console.log("----------")
			//console.log(data)
			for (var i = 0; i < data.length; i++) {
				var geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value),
					});
				}
			}
			//console.log(convertData);
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
								//console.log(toolTipData[i].name)

								toolTiphtml += toolTipData[i].name + ':（' + toolTipData[i].updatetime + '）<br>'
								for (var j = 0; j < toolTipData[i].value.length; j++) {
									toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
								}


							}
						}
						//console.log(toolTiphtml)
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
						//console.log(toolTiphtml)
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
				show: false,
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
						show: false
					},
					emphasis: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						color: '#000000'
					}
				}
			},
			{
				type: 'map', // 类型
				// 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
				map: mapName,
				// 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
				roam: false,
				// 图形上的文本标签
				label: {
					normal: {
						show: false
					},
					emphasis: {
						show: true,
						textStyle: {
							color: '#000000'
						}
					}
				},
				// 地图区域的多边形 图形样式
				itemStyle: {
					normal: {
						areaColor: '#ffffff',
						borderColor: '#3B5077',
					},
					emphasis: {
						areaColor: '#2B91B7'
					}
				},
				animation: false,
				data: data
			}
			]
		};
		myChart.setOption(option);
	}
});