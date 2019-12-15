var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table"); // table dependencie for better view

// Connection with MySql

var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"rubinho",
	database:"bamazon_db"
});

connection.connect(function(err){
	if(err)throw err;
	console.log("\nconnected as id: " + connection.threadId);
});

// Displaying All Products For User Choice

var displayProducts = function(){
	var query = "Select * FROM products";
	connection.query(query, function(err, res){
		if(err) throw err;
		process.stdout.write("\u001b[2J\u001b[0;0H"); // clear the screen and begin at 0 point
		var displayTable = new Table ({
			head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"],
			colWidths: [11,25,20,10,10]
		});
		for(var i = 0; i < res.length; i++){
			displayTable.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(displayTable.toString());
		purchasePrompt();
	});
}

// Purchase Prompt 

function purchasePrompt(){
	inquirer.prompt([
	{
		name: "ID",
		type: "input",
		message:"Please enter Item ID you like to purhcase.",
		filter:Number
	},
	{
		name:"Quantity",
		type:"input",
		message:"How many items do you wish to purchase?",
		filter:Number
	},

 ]).then(function(answers){
 	var quantityNeeded = answers.Quantity;
 	var IDrequested = answers.ID;
 	purchaseOrder(IDrequested, quantityNeeded);
 });
};

// Purchase Order, if statment checking the quantity

function purchaseOrder(ID, amtNeeded){
	connection.query('Select * FROM products WHERE item_id = ' + ID, function(err,res){
		if(err){console.log(err)};
		if(amtNeeded <= res[0].stock_quantity){
			var totalCost = res[0].price * amtNeeded;
			console.log("\nGood news your order is in stock!");
			console.log("\nYour total cost for " + amtNeeded + " " +res[0].product_name + " is " + totalCost + " Thank you!\n");

			connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amtNeeded + " WHERE item_id = " + ID);
		} else{
			console.log("\nInsufficient quantity, sorry we do not have enough " + res[0].product_name + " to complete your order, Please try again \n");
		};
		// Option for buy again or Exit the App
		
		inquirer.prompt([{
			name: "action",
			type: "list",
			message: "[BUY] Again or [EXIT]?",
			choices: ["Buy Again", "Exit"]
		}]).then(function (answers) {
			switch (answers.action) {
				case 'Buy Again':
					process.stdout.write("\u001b[2J\u001b[0;0H");
					displayProducts();
					break;
				case 'Exit':
					connection.end();
					break;
			}
		});
	});
};

displayProducts(); 