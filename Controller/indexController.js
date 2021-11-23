/*
 * @Author: e4glet
 * @Date: 2020-02-25 13:49:33
 * @LastEditTime: 2020-03-31 19:32:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Nodejs-2019-nCoVDataSys\Controller\indexController.js
 */

var request = require("request");
var cheerio = require("cheerio");

function indexController(app) {
    // body...
    /* GET home page. */
    //app.get方法第一个参数是我们添加网站可以请求的地址
    app.get('/', function (req, res, next) {
        console.log('index')
        res.render('cov_index');
    });

    app.get('/cov_index', function (req, res, next) {

        res.render('index');
    });

    app.get('/world', function (req, res, next) {

        res.render('cov_world');
    });

    app.get('/city', function (req, res, next) {
        res.render('city');
    });

    app.get('/china', function (req, res, next) {
        res.render('china');
    });

    app.get('/about', function (req, res, next) {
        res.render('cov_about');
    });

    //中间件
    app.post('/getJsonData', function (req, res, next) {
        //
        //https://view.inews.qq.com/g2/getOnsInfo?name=disease_other
        //https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign

        var getData;
        request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5', function (err, result) {
            if (err) {
                console.log(err);
            }

            getData = result.body;
            var jsData = JSON.parse(JSON.parse(getData).data);
            //console.log(jsData);
            res.send(jsData);
        })
    });

    app.post('/getJsonforeign', function (req, res, next) {
        //
        //

        var getData1;
        var getData2;
        request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign', function (err, result) {
            if (err) {
                console.log(err);
            }

            request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5', function (err, resultdata) {
                if (err) {
                    console.log(err);
                }

                getData1 = resultdata.body;
                var jsData1 = JSON.parse(JSON.parse(getData1).data);
                //console.log(jsData);
                getData2 = result.body;
                var jsData2 = JSON.parse(JSON.parse(getData2).data);

                var worlddata = new Object()
                worlddata.china = jsData1
                worlddata.foreign = jsData2

                //console.log(worlddata)
                
                res.send(worlddata);
            })

            // getData2 = result.body;
            // var jsData2 = JSON.parse(JSON.parse(getData).data);
            // console.log(jsData);
            // res.send(jsData);
        })
    });


    app.post('/getJsonOther', function (req, res, next) {
        //
        //

        var getData;
        request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_other', function (err, result) {
            if (err) {
                console.log(err);
            }


            getData = result.body;
            var jsData = JSON.parse(JSON.parse(getData).data);
            //console.log(jsData);
            res.send(jsData);
        })
    });
}


module.exports = indexController;