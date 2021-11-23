/*
 * @Author: e4glet
 * @Date: 2020-02-25 13:49:33
 * @LastEditTime: 2020-03-31 19:32:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Nodejs-2019-nCoVDataSys\Controller\categoryController.js
 */


function categoryController(app) {
	// body...
	/* GET home page. */
	//app.get方法第一个参数是我们添加网站可以请求的地址
    app.get('/category', function(req, res, next) {
    	//res.render方法的第一个参数是我们请求地址对应的网页文件名
    	console.log('Category/index');
        res.render('Category/index');
    });
}


module.exports = categoryController;