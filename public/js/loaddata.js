$(document).ready(function() {

	
	$.ajax({
		type: "post",
		url: "/getJsonData", 
		datatype: "json",
		crossDomain: true,
		success: function(data, status) {
			if(status == "success") {

				var jsondata = JSON.parse(data);
				//console.log(data);
				//alert('ok');

				getNewDayTotals(jsondata);
				getNewDayAdds(jsondata);

				
				
                var citytotaldata,citydetailsdata,lastUpdateTime;
				citytotaldata = convertConfirmTotalData(jsondata);
				citydetailsdata = convertCityDetailsData(jsondata);
				lastUpdateTime = getlastUpdateTime(jsondata);
				
				
				loadEcharts(citytotaldata,citydetailsdata,lastUpdateTime);

				var daydata = getchinaDayList(jsondata);
				var daydetailsdata = getchinaDetailsDatalList(jsondata);
				
				loadStackLineEcharts(daydata,daydetailsdata);

				//新增确诊与新增治愈
				var addsdaydata = getchinaaddsStackDayList(jsondata);
				var addsdaydetailsdata = getchinaaddsStackDataList(jsondata);
				
				loadAddsStackLineEcharts(addsdaydata,addsdaydetailsdata);
			} else {
				alert('error');
			}
		},
		error: function(err, status) {
			alert('loading data error');
		}
	});
	
	function getlastUpdateTime(data){
		return JSON.parse(data.data).lastUpdateTime;		
	}

	//处理数据
	//省市及最新确诊病例
	function convertConfirmTotalData(data) {
		var firstconvertdata = JSON.parse(data.data).areaTree;
		var secondconvertdata = firstconvertdata[0].children;

        //console.log('第一组数据');
        
		var mydata = [];
		for(i = 0; i < secondconvertdata.length; i++) {
			var city = new Object();
			city.name = secondconvertdata[i].name;
			city.value = secondconvertdata[i].total.confirm;
			
			mydata.push(city);
		}

		return mydata;
	}
	
	//数据处理
	//省市确诊，治愈，死亡病例
	function convertCityDetailsData(data){
		var firstconvertdata = JSON.parse(data.data).areaTree;
		var secondconvertdata = firstconvertdata[0].children;
		
		//console.log('第二组数据');
		
		var mydata=[];
		for(i=0;i < secondconvertdata.length; i++){
			var city = new Object();
			city.name = secondconvertdata[i].name;			
			city.value = [];
			
			var confirm =new Object;
			confirm.name="确诊病例";
			confirm.value=secondconvertdata[i].total.confirm;
			city.value.push(confirm);
			
			var heal =new Object;
			heal.name="治愈病例";
			heal.value=secondconvertdata[i].total.heal;
			city.value.push(heal);
			
			var dead =new Object;
			dead.name="死亡病例";
			dead.value=secondconvertdata[i].total.dead;
			city.value.push(dead);
			//
			mydata.push(city);
		}
		
		
		return mydata;
	}

	function loadEcharts(data,toolTipData,lastUpdateTime) {

		//
		var name_title = "新型冠状病毒肺炎全国疫情趋势图"
		var subname = '数据爬取自腾讯接口数据 '+' 最后更新时间 '+lastUpdateTime
		var nameColor = " rgb(55, 75, 113)"
		var name_fontFamily = '等线'
		var subname_fontSize = 15
		var name_fontSize = 18
		var mapName = 'china'
		

		var geoCoordMap = {};

		var dom = document.getElementById('chartmap-panel');
		var myChart = echarts.init(dom);

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
				splitNumber:4,
				pieces: [{
					min:1,
					max: 99,
					label:'1-99',
					text:'1-99'
				},
				{
					min:100,
					max: 999,
					label:'10-999'
				},
				{
					min:1000,
					max: 9999,
					label:'1000-9999'
				},
				{
					min:10000,
					label:'>10000'
				}
				],
				itemWidth:50,
				showLabel:true,
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


	//Stack-line
	//数据处理
	function getchinaDayList(data) {
		var getdata = JSON.parse(data.data).chinaDayList;
		
		var daydata = [];
		for(i=0;i<getdata.length;i++){
			daydata.push(getdata[i].date);
		}
		//console.log(daydata);
		return daydata;
	}
	
	function getchinaDetailsDatalList(data){
		var getdata = JSON.parse(data.data).chinaDayList;
		
		//console.log(getdata);
		var detailsdatas = [];
		
		var details=new Object();
		details.value = [] ;
		for(i=0;i<getdata.length;i++){
			details.value.push(getdata[i].confirm);			
		}
		detailsdatas.push(details);
		
		var details=new Object();
		details.value = [] ;
		for(i=0;i<getdata.length;i++){			
			details.value.push(getdata[i].suspect);
		}
		detailsdatas.push(details);
		
		var details=new Object();
		details.value = [] ;
		for(i=0;i<getdata.length;i++){
			details.value.push(getdata[i].heal);
		}
		detailsdatas.push(details);
		
		var details=new Object();
		details.value = [] ;
		for(i=0;i<getdata.length;i++){
			details.value.push(getdata[i].dead);
		}
		detailsdatas.push(details);
		
		
		
		//console.log("处理后");
		//console.log(detailsdatas);
		
		return detailsdatas;
	}

	function loadStackLineEcharts(daydata,daydetailsdata) {
		//初始化ehcharts实例
			var myChart = echarts.init(document.getElementById("stack-line-panel"));

			//清洗后的近7天数据
			data = daydetailsdata;
			
			//console.log(data[0].value);

			//指定图表的配置项和数据
			var option = {
				title: {
					text: '全国疫情趋势图',
					subtext:'单位：例'
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['确诊', '疑似', '治愈', '死亡']
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
						symbolSize: 8,
						data: data[0].value
					},
					{
						name: '疑似',
						type: 'line',
						symbol: 'circle', //拐点样式
						symbolSize: 8,
						data: data[1].value
					},
					{
						name: '治愈',
						type: 'line',
						symbol: 'circle', //拐点样式
						symbolSize: 8,
						data: data[2].value
					},
					{
						name: '死亡',
						type: 'line',
						symbol: 'circle', //拐点样式
						symbolSize: 8,
						data: data[3].value
					}
				]
			};
			//使用刚刚指定的配置项和数据项显示图表
			myChart.setOption(option);
	}

	//Vtop
	//获取最新疫情总数报告
	function getNewDayTotals(data){
		var getdata = JSON.parse(data.data).chinaTotal;
		$('.set-confirm').text(getdata.confirm);
		$('.set-suspect').text(getdata.suspect);
		$('.set-heal').text(getdata.heal);
		$('.set-dead').text(getdata.dead);
		//console.log(getdata);
	}
	
	//获取新增数量
	function getNewDayAdds(data){
		var getdata = JSON.parse(data.data).chinaAdd;
		$('.set-confirmadd').text('+'+getdata.confirm);
		$('.set-suspectadd').text('+'+getdata.suspect);
		$('.set-healadd').text('+'+getdata.heal);
		$('.set-deadadd').text('+'+getdata.dead);
		//console.log(getdata);
	}

	//新增确诊与新增治愈
	//数据处理
	function getchinaaddsStackDayList(data) {
		var getdata = JSON.parse(data.data).chinaDayList;
		
		var daydata = [];
		for(i=1;i<getdata.length;i++){
			daydata.push(getdata[i].date);
		}
		//console.log(daydata);
		return daydata;
	}
	
	//当前方法为获取每天详细人数，新增人数为当天减去前一天的人数
	function getchinaaddsStackDataList(data){
		var getdata = JSON.parse(data.data).chinaDayList;
		
		console.log(getdata);
		var detailsdatas = [];
		
		var details=new Object();
		details.value = [] ;
		for(i=0;i<getdata.length;i++){
			details.value.push(getdata[i].confirm);			
		}
		detailsdatas.push(details);
		
		var details=new Object();
		details.value = [] ;
		for(i=0;i<getdata.length;i++){			
			details.value.push(getdata[i].suspect);
		}
		detailsdatas.push(details);
		
		var details=new Object();
		details.value = [] ;
		for(i=0;i<getdata.length;i++){
			details.value.push(getdata[i].heal);
		}
		detailsdatas.push(details);
		
		var details=new Object();
		details.value = [] ;
		for(i=0;i<getdata.length;i++){
			details.value.push(getdata[i].dead);
		}
		detailsdatas.push(details);
		
		
		
		console.log("处理后");
		console.log(detailsdatas);
		
		//新增确诊病例数组
		var newAddsConfirm = [];
		for(i=1;i<detailsdatas[0].value.length;i++){
			var perdayadds = detailsdatas[0].value[i]-detailsdatas[0].value[i-1];
            newAddsConfirm.push(perdayadds);
		}		
		
		console.log(newAddsConfirm);
		
		//新增疑似病例
		var newAddsSuspect = [];
		for(i=1;i<detailsdatas[2].value.length;i++){
			var perdayadds = detailsdatas[2].value[i]-detailsdatas[2].value[i-1];
            newAddsSuspect.push(perdayadds);
		}
		
		console.log(newAddsSuspect);
		
		var addsStackData =new Object();
		addsStackData.newconfirmadds = newAddsConfirm;
		addsStackData.newsuspectadds = newAddsSuspect;
		
		return addsStackData;
	}

	function loadAddsStackLineEcharts(addsdaydata,addsdaydetailsdata) {
		//初始化ehcharts实例
			var myChart = echarts.init(document.getElementById("adds-stack-line-panel"));

			//清洗后的近7天数据
			data = addsdaydetailsdata;
			
			console.log(data);

			//指定图表的配置项和数据
			var option = {
				title: {
					text: '新增确诊与新增治愈趋势图',
					subtext:'单位：例'
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
						symbolSize: 8,
						data: data.newconfirmadds
					},
					{
						name: '新增治愈',
						type: 'line',
						symbol: 'circle', //拐点样式
						symbolSize: 8,
						data: data.newsuspectadds
					}
				]
			};
			//使用刚刚指定的配置项和数据项显示图表
			myChart.setOption(option);
	}
});