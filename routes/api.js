'use strict';

var express = require('express');
var shopcontroller = require('../controllers/shopcontroller');

var router = express.Router();
	
	router.route('/productlines')
		.get(shopcontroller.list_all_productlines);

	router.route('/listorders/:customerNumber')
		.get(shopcontroller.list_all_orders)
		.post(shopcontroller.list_all_orders);
	
	router.route('/listorderdetails/:orderNumber')
		.get(shopcontroller.list_orders_details)
		.post(shopcontroller.list_orders_details);	
	router.route('/listproducts')
		.get(shopcontroller.list_products);
	
	router.route('/listproductdetails/:productCode')
		.get(shopcontroller.list_product_details)
		.post(shopcontroller.list_product_details);
	
module.exports = router;
