'use strict';

var mysql = require('mysql'); 
const config = require('.././config/database');

exports.list_all_productlines = function(req, res) {
	var con = dbConnect();
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		var sql = "SELECT * FROM productlines";
		var query = require('url').parse(req.url,true).query;
		var productName = query.q;
		if(productName !== undefined)
			sql = "SELECT * FROM productlines where productLine in(select products.productLine from products where products.productName = '"+productName+"');"		
		con.query(sql, function (err, result, fields) {
		if (err) throw err;
		console.log(result);
		res.json(result);
		});
	});
};

exports.list_all_orders = function(req, res) { 
	var con = dbConnect();
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");  
		var sql = "SELECT o.customerNumber, c.customerName,c.contactLastName,c.contactFirstName,c.phone,c.addressLine1,c.addressLine2,c.city,c.state,c.postalCode,c.country,o.orderNumber,o.orderDate,o.requiredDate,o.shippedDate,o.status,o.comments from orders o, customers c  WHERE o.customerNumber = c.customerNumber and o.customerNumber = "+req.params.customerNumber;  
		var query = require('url').parse(req.url,true).query;
		var customerName = query.x;
		var productName = query.q;
		if(productName !== undefined) {
			sql = "select o.customerNumber, c.customerName,c.contactLastName,c.contactFirstName,c.phone,c.addressLine1,c.addressLine2,c.city,c.state,c.postalCode,c.country,o.orderNumber,o.orderDate,o.requiredDate,o.shippedDate,o.status,o.comments from customers c,orders o,orderdetails od, products p where o.customerNumber = c.customerNumber AND o.orderNumber = od.orderNumber AND od.productcode = p.productCode AND c.customernumber = " + req.params.customerNumber + " AND p.productName = '"+productName+"'";
			if(customerName !== undefined)
				sql += " and c.customerName ='"+customerName+"'";			
		}
		else if(customerName !== undefined)			
			sql += " and c.customerName = '"+customerName+"'";		
		con.query(sql, function (err, result, fields) {
			if (err) throw err;    
			var myJson = {'data':result, 'total':result.length};
			res.json(myJson);
		});
	});
};

exports.list_orders_details = function(req, res) {
	var con = dbConnect();
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		var sql = "select c.customerNumber,c.customerName,c.contactLastName,c.contactFirstName,c.phone,c.addressLine1,c.addressLine2,c.city,c.state,c.postalCode,c.country,o.orderNumber,o.orderDate,o.requiredDate,o.shippedDate,o.status,o.comments,od.productCode,od.quantityOrdered,od.priceEach,p.productName,p.productLine from customers c, orders o, orderdetails od, products p where c.customerNumber = o.customerNumber and o.orderNumber = od.orderNumber and p.productCode = od.productCode and od.orderNumber = "+req.params.orderNumber;
		var query = require('url').parse(req.url,true).query;
		var productName = query.q;
		var customerName = query.x;
		var limit = query.limit;
		var offset = query.offset;
		if(productName !== undefined)		
			sql += " and p.productName = '"+productName+"'";		
		if(customerName !== undefined)
			sql += " and c.customerName = '"+customerName+"'";		
		if(limit !== undefined) {		
			sql += " LIMIT "+limit;		
			if(offset !== undefined)		
				sql += " OFFSET "+offset;		
		}	
		con.query(sql, function (err, result, fields) {
			if (err) throw err;    	
			var myJson = {'data':result, 'total':result.length};
			res.json(myJson);	 
		});
	});
};

exports.list_products = function(req, res) {  
	var con = dbConnect();
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");  
		var sql = "select buyprice,msrp,productcode,productdescription,productline,productname,productscale,productvendor,quantityinstock from products";
		var query = require('url').parse(req.url,true).query;
		var limit = query.limit;
		var offset = query.offset;
		var productName = query.q;
		var customerName = query.x;
		if(customerName !== undefined) {
			var sql = "select buyprice,msrp,productcode,productdescription,productline,productname,productscale,productvendor,quantityinstock from products where productcode in(select productcode from orderdetails where ordernumber in(select o.ordernumber from customers c,orders o where c.customerNumber = o.customerNumber and c.customerName = '"+customerName+"'))";
			if(productName !== undefined)				
				sql += " and productName = '"+productName+"'";				
		}
		else if(productName !== undefined)		
			sql += " where productName = '"+productName+"'";		  
		if(limit !== undefined) {		
			sql += " LIMIT "+limit;		
			if(offset !== undefined)		
				sql += " OFFSET "+offset;				
		}  
		con.query(sql, function (err, result, fields) {
			if (err) throw err;	
			var myJson = {'data':result, 'total':result.length};	
			res.json(myJson);	 
		});
	});  
};

exports.list_product_details = function(req, res) {
	var con = dbConnect();
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");  
		var sql = "select buyprice,msrp,productcode,productdescription,productline,productname,productscale,productvendor,quantityinstock from products where productcode = '"+req.params.productCode+"'";
		var query = require('url').parse(req.url,true).query;
		var productName = query.q;
		var customerName = query.x;
		if(customerName !== undefined) {
			sql = "select p.buyprice,p.msrp,p.productcode,p.productdescription,p.productline,p.productname,p.productscale,p.productvendor,p.quantityinstock from customers c, orders o, orderdetails od, products p where c.customerNumber = o.customerNumber and o.orderNumber = od.orderNumber and p.productCode = od.productCode and p.productCode = 'S10_1949' and c.customerName = '"+customerName+"'";
			if(productName !== undefined)		
				sql += " and p.productName = '"+productName+"'";		
		}
		else if(productName !== undefined)
			sql += " and productName = '"+productName+"'";
		con.query(sql, function (err, result, fields) {
			if (err) throw err;
			res.json(result);	 
		});
	});
};

function dbConnect(){
	return 	mysql.createConnection({
			host: config.host,
			user: config.user,
			password: config.password,
			database:config.database
			});	
}