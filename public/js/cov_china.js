$(document).ready(function() {

	$.ajax({
		type: "post",
		url: "/getJsonData",
		datatype: "json",
		crossDomain: true,
		success: function(data, status) {
			if(status == "success") {
				var jsData = data;

				getNewDayTotals(jsData);
				getNewDayAdds(jsData);
				//				
				loadEcharts(covertCityConfirmAndDetailsData(jsData), getlastUpdateTime(jsData));

				//饼图
				//setPieData(getHealRateData(jsData));

			} else {
				alert('error');
			}
		},
		error: function(err, status) {
			alert('loading data error');
		}
	});

	function getlastUpdateTime(data) {
		//return JSON.parse(data.data).lastUpdateTime;
		return data.lastUpdateTime;
	}

	//合并数据处理，优化性能
	function covertCityConfirmAndDetailsData(data) {
		var firstconvertdata = data.areaTree;
		var secondconvertdata = firstconvertdata[0].children;

		var cityData = new Object();

		var cityconfirmtotoaldata = [];
		var citydetailsdata = [];

		for(i = 0; i < secondconvertdata.length; i++) {
			var cityconfirm = new Object();
			var citydetails = new Object();
			cityconfirm.name = secondconvertdata[i].name;
			//只计算在诊总数
			cityconfirm.value = parseInt(secondconvertdata[i].total.confirm) - parseInt(secondconvertdata[i].total.heal) - parseInt(secondconvertdata[i].total.dead)
			//cityconfirm.value = secondconvertdata[i].total.confirm;

			cityconfirmtotoaldata.push(cityconfirm);

			//第二组数据
			var city = new Object();
			city.name = secondconvertdata[i].name;
			city.value = [];

			var confirm = new Object;
			confirm.name = "在诊病例";
			confirm.value = parseInt(secondconvertdata[i].total.confirm) - parseInt(secondconvertdata[i].total.heal) - parseInt(secondconvertdata[i].total.dead);
			city.value.push(confirm);

			var heal = new Object;
			heal.name = "已治愈";
			heal.value = secondconvertdata[i].total.heal;
			city.value.push(heal);

			var dead = new Object;
			dead.name = "病亡病例";
			dead.value = secondconvertdata[i].total.dead;
			city.value.push(dead);
			//
			citydetailsdata.push(city);
		}

		cityData.cityconfirmtotoaldata = cityconfirmtotoaldata;
		cityData.citydetailsdata = citydetailsdata;

		return cityData;
	}

	//其他国家疫情数据
	//要两个数组
	function otherCountryData(data) {
		var firstconvertdata = data.foreignList;

		//		console.log(firstconvertdata);

		var countrydata = new Object();
		var countrylist = [];
		var countrydatalist = [];
		var othercountrydetailsdata = [];

		//for(i = 0; i < firstconvertdata.length; i++) {
		for(i = 0; i < 10; i++) {
			if(firstconvertdata[i].name != '中国') {
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

	//标准中国地图
	function loadchinaMap(cityData, lastUpdateTime) {

	}

	//全国地图图形
	//非标准 测试修改
	function loadEcharts(cityData, lastUpdateTime) {

		var data = cityData.cityconfirmtotoaldata;
		var toolTipData = cityData.citydetailsdata;

		//
		var name_title = "新型冠状病毒肺炎全国疫情趋势图"
		var subname = '数据爬取自腾讯接口数据 ' + ' 最后更新时间 ' + lastUpdateTime
		var nameColor = " rgb(55, 75, 113)"
		var name_fontFamily = '等线'
		var subname_fontSize = 15
		var name_fontSize = 18
		var mapName = 'china'

		var geoCoordMap = {};

		var dom = document.getElementById('chartmap-panel');
		var myChart = echarts.init(dom);

		$.getJSON('../map/json/china_new.json', function(geoJson) {
			/*获取地图数据*/
			myChart.showLoading();
			var mapFeatures = echarts.getMap(mapName).geoJson.features;
			myChart.hideLoading();

			mapFeatures.forEach(function(v) {
				// 地区名称
				var name = v.properties.name;
				// 地区经纬度
				geoCoordMap[name] = v.properties.cp;

			});

			//			var d = [];
			//			for (var i = 0; i < data.features.length; i++) {
			//				d.push({
			//					name: data.features[i].properties.name
			//				})
			//			}
			//renderMap(mapName, d);

			//			var geoCoordMap = geoJson.features.map(function(item) {
			//				return {
			//					name: item.properties.name,
			//					value: item.properties.childNum,
			//					cp: item.properties.cp,
			//				}
			//			});

			//console.log(data)

			var max = 48,
				min = 9; // todo 
			var maxSize4Pin = 10,
				minSize4Pin = 2;

			//获取数据
			var convertData = function(data) {
				var res = [];
				for(var i = 0; i < data.length; i++) {
					var geoCoord = geoCoordMap[data[i].name];
					if(geoCoord) {
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
					formatter: function(params) {
						if(typeof(params.value)[2] == "undefined") {
							var toolTiphtml = ''
							for(var i = 0; i < toolTipData.length; i++) {
								if(params.name == toolTipData[i].name) {
									toolTiphtml += toolTipData[i].name + ':<br>'
									for(var j = 0; j < toolTipData[i].value.length; j++) {
										toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
									}
								}
							}
							//console.log(toolTiphtml)
							// console.log(convertData(data))
							return toolTiphtml;
						} else {
							var toolTiphtml = ''
							for(var i = 0; i < toolTipData.length; i++) {
								if(params.name == toolTipData[i].name) {
									toolTiphtml += toolTipData[i].name + ':<br>'
									for(var j = 0; j < toolTipData[i].value.length; j++) {
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
					left: 'left',
					top: 'bottom',
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
								areaColor: '#ffffff',
								borderColor: '#3B5077',
							},
							emphasis: {
								areaColor: '#2B91B7'
							}
						},
						animation: false,
						data: data
					},
				]
			};
			echarts.registerMap(mapName, geoJson);
			myChart.setOption(option);

		});

	}

	//Stack-line
	//数据处理
	function getchinaDayList(data) {
		var getdata = data.chinaDayList;

		//console.log(data);

		var daydata = [];
		for(i = 0; i < getdata.length; i++) {
			daydata.push(getdata[i].date);
		}
		//console.log(daydata);
		return daydata;
	}

	function getchinaDetailsDatalList(data) {
		var getdata = data.chinaDayList;

		var detailsdatas = [];

		var details1 = new Object();
		details1.value = [];
		var details2 = new Object();
		details2.value = [];
		var details3 = new Object();
		details3.value = [];
		var details4 = new Object();
		details4.value = [];
		for(i = 0; i < getdata.length; i++) {
			details1.value.push(getdata[i].confirm);
			details2.value.push(getdata[i].suspect);
			details3.value.push(getdata[i].heal);
			details4.value.push(getdata[i].dead);
		}

		detailsdatas.push(details1);
		detailsdatas.push(details2);
		detailsdatas.push(details3);
		detailsdatas.push(details4);

		//		console.log("处理后");
		//		console.log(detailsdatas);

		return detailsdatas;
	}

	//全国数据线性图
	function loadStackLineEcharts(daydata, daydetailsdata) {
		//初始化ehcharts实例
		var myChart = echarts.init(document.getElementById("stack-line-panel"));

		//清洗后的近7天数据
		data = daydetailsdata;

		//console.log(data[0].value);

		//指定图表的配置项和数据
		var option = {
			title: {
				text: '',
				subtext: '单位：例'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['确诊', '疑似', '治愈', '病亡']
			},
			color: ['#e83132', '#ec9217', '#10aeb5', '#4d5054'], //颜色
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: daydata,
				axisLine: { //坐标轴线
					lineStyle: {
						opacity: 0.01, //透明度为0 
					},
				},
				axisTick: { //y轴刻度线
					show: false
				}
			},
			yAxis: {
				type: 'value',
				//name: '单位：例',
				//					nameTextStyle: {
				//						color: '#444e65',
				//						align: 'left', //文字水平对齐方式
				//						verticalAlign: 'middle', //文字垂直对齐方式
				//					},
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
				axisTick: { //y轴刻度线
					show: false
				},
				axisLine: { //坐标轴线
					lineStyle: {
						opacity: 0, //透明度为0 
					},
				},
			},
			series: [{
					name: '确诊',
					type: 'line',
					symbol: 'circle', //拐点样式
					symbolSize: 5,
					data: data[0].value
				},
				{
					name: '疑似',
					type: 'line',
					symbol: 'circle', //拐点样式
					symbolSize: 5,
					data: data[1].value
				},
				{
					name: '治愈',
					type: 'line',
					symbol: 'circle', //拐点样式
					symbolSize: 5,
					data: data[2].value
				},
				{
					name: '病亡',
					type: 'line',
					symbol: 'circle', //拐点样式
					symbolSize: 5,
					data: data[3].value
				}
			]
		};
		//使用刚刚指定的配置项和数据项显示图表
		myChart.setOption(option);
	}

	//Vtop
	//获取最新疫情总数报告
	function getNewDayTotals(data) {
		var getdata = data.chinaTotal;
		$('.set-confirm').text(getdata.confirm);
		$('.set-suspect').text(getdata.suspect);
		$('.set-heal').text(getdata.heal);
		$('.set-dead').text(getdata.dead);
		//console.log(getdata);
	}

	//获取新增数量
	function getNewDayAdds(data) {
		var getdata = data.chinaAdd;
		$('.set-confirmadd').text('+' + getdata.confirm);
		$('.set-suspectadd').text('+' + getdata.suspect);
		$('.set-healadd').text('+' + getdata.heal);
		$('.set-deadadd').text('+' + getdata.dead);
		//console.log(getdata);
	}

	//计算治愈率
	function getHealRateData(data) {
		var getdata = data.chinaTotal;
		var total = getdata.confirm;
		var heal = getdata.heal;
		var dead = getdata.dead;

		var pieData = [];
		var perPieData = new Object();
		perPieData.name = '治疗中';
		//确诊总病例减去治愈和死亡病例
		perPieData.value = parseInt(total) - parseInt(heal) - parseInt(dead);
		pieData.push(perPieData);

		perhealdata = new Object();
		perhealdata.name = '已治愈';
		perhealdata.value = heal;

		pieData.push(perhealdata);

		var perdeaddata = new Object
		perdeaddata.name = '病亡';
		perdeaddata.value = getdata.dead;

		pieData.push(perdeaddata);

		return pieData;

	}

	//新增确诊与新增治愈
	//数据处理
	//0314
	function getchinaaddsStackDayList(data) {
		var getdata = data.chinaDayAddList;

		var daydata = [];
		for(i = 8; i < getdata.length; i++) {
			daydata.push(getdata[i].date);
		}
		//console.log("天数"+daydata);
		return daydata;
	}

	//当前方法为获取每天详细人数，新增人数为当天减去前一天的人数
	function getchinaaddsStackDataList(data) {
		//var getdata = data.chinaDayAddList;

		var dailyNewAdds = data.chinaDayAddList;

		//console.log(dailyNewAdds)

		//新增确诊病例数组
		var newAddsConfirm = [];
		var newAddsSuspect = [];
		for(i = 1; i < dailyNewAdds.length; i++) {
			var perdayadds = dailyNewAdds[i].confirm;
			newAddsConfirm.push(perdayadds);

			var perdayadds = dailyNewAdds[i].heal;
			newAddsSuspect.push(perdayadds);
		}

		var addsStackData = new Object();
		addsStackData.newconfirmadds = newAddsConfirm;
		addsStackData.newsuspectadds = newAddsSuspect;

		return addsStackData;
	}

	//新增数据线性图
	function loadAddsStackLineEcharts(addsdaydata, addsdaydetailsdata) {
		//初始化ehcharts实例
		var myChart = echarts.init(document.getElementById("adds-stack-line-panel"));

		//清洗后的近7天数据
		data = addsdaydetailsdata;

		//指定图表的配置项和数据
		var option = {
			title: {
				text: '',
				subtext: '单位：例'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['新增确诊', '新增治愈']
			},
			color: ['#e83132', '#10aeb5'], //颜色
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: addsdaydata,
				axisLine: { //坐标轴线
					lineStyle: {
						opacity: 0.01, //透明度为0 
					},
				},
				axisTick: { //y轴刻度线
					show: false
				}
			},
			yAxis: {
				type: 'value',
				//name: '单位：例',
				//					nameTextStyle: {
				//						color: '#444e65',
				//						align: 'left', //文字水平对齐方式
				//						verticalAlign: 'middle', //文字垂直对齐方式
				//					},
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
				axisTick: { //y轴刻度线
					show: false
				},
				axisLine: { //坐标轴线
					lineStyle: {
						opacity: 0, //透明度为0 
					},
				},
			},
			series: [{
					name: '新增确诊',
					type: 'line',
					symbol: 'circle', //拐点样式
					symbolSize: 5,
					data: data.newconfirmadds
				},
				{
					name: '新增治愈',
					type: 'line',
					symbol: 'circle', //拐点样式
					symbolSize: 5,
					data: data.newsuspectadds
				}
			]
		};
		//使用刚刚指定的配置项和数据项显示图表
		myChart.setOption(option);
	}

	//饼图
	function setPieData(data) {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('totalPieData'));

		myChart.setOption({
			title: [{
				text: '国内治愈率'
			}, ],
			color: ['#e83132', '#10aeb5', '#000000'], //颜色
			series: [{
				name: '访问来源',
				type: 'pie', // 设置图表类型为饼图
				radius: '55%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
				data: data,
				itemStyle: {
					normal: {
						label: {
							show: true,
							formatter: '{b}:({d}%)'
						},
						labelLine: {
							show: true
						}
					}
				}
			}]
		})
	}

	//柱状图
	function setBarData(data) {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('countryBarData'));
		// {name:"北京",value:[{name:"文科",value:95},{name:"理科",value:82}]}
		var toolTipData = data.othercountrydetailsdata;

		myChart.setOption({
			title: [{
				text: '其他国家最新疫情数据(TOP10)'
			}, ],
			xAxis: {
				type: 'category',
				data: data.countrylist,
				axisLabel: {
					interval: 0, //强制文字产生间隔
					rotate: -45, //文字逆时针旋转45°
					textStyle: { //文字样式
						color: "black",
						fontSize: 12,
						fontFamily: 'Microsoft YaHei'
					}
				}
			},
			yAxis: {
				type: 'value'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				},
				formatter: function(params) {

					if(typeof(params.value) == 'undefined') {
						var toolTiphtml = ''
						for(var i = 0; i < toolTipData.length; i++) {
							if(params[0].name == toolTipData[i].name) {
								toolTiphtml += toolTipData[i].name + ':<br>'
								for(var j = 0; j < toolTipData[i].value.length; j++) {
									toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
								}
							}
						}

						return toolTiphtml;
					} else {
						var toolTiphtml = ''
						for(var i = 0; i < toolTipData.length; i++) {
							if(params[0].name == toolTipData[i].name) {
								toolTiphtml += toolTipData[i].name + ':<br>'
								for(var j = 0; j < toolTipData[i].value.length; j++) {
									toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
								}
							}
						}
						//console.log(toolTiphtml)
						return toolTiphtml;
					}
				}
			},
			series: [{
				data: data.countrydatalist,
				type: 'bar'
			}]
		})
	}
});