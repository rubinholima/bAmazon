var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table"); // table dependencie for better view

// Connection with MySql

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rubinho",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

// Displaying All inventory For the ManagerUser Choice

function displayInventory() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) {
            console.log(err)
        };
        process.stdout.write("\u001b[2J\u001b[0;0H"); // clear the screen and begin at 0 point
        var theDisplayTable = new Table({
            head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
            colWidths: [10, 25, 25, 10, 14]
        });
        for (i = 0; i < res.length; i++) {
            theDisplayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(theDisplayTable.toString());
        inquirerForUpdates();
    });
};

// Inquires For Updates, for Restock, Add new Product, Remove an Item or Exit
function inquirerForUpdates() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Choose an option below to manage current inventory:",
        choices: ["Restock Inventory", "Add New Product", "Remove An Existing Product", "Exit"]
    }]).then(function (answers) {
        switch (answers.action) {
            case 'Restock Inventory':
                restockRequest();
                break;
            case 'Add New Product':
                addRequest();
                break;
            case 'Remove An Existing Product':
                removeRequest();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
};

//Restock Function
function restockRequest() {
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "What is the item ID of the item that you would like to restock?"
        },
        {
            name: "Quantity",
            type: "input",
            message: "What is the quantity you would like to add?"
        },
    ]).then(function (answers) {
        var quantityAdded = answers.Quantity;
        var IDOfProduct = answers.ID;
        restockInventory(IDOfProduct, quantityAdded);
    });
};

// Restock update the Mysql
function restockInventory(id, quant) {
    connection.query('SELECT * FROM Products WHERE item_id = ' + id, function (err, res) {
        if (err) {
            console.log(err)
        };
        connection.query('UPDATE Products SET stock_quantity = stock_quantity + ' + quant + ' WHERE item_id =' + id);

        displayInventory();
    });
};

// Add Request Function
function addRequest() {
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "Add ID Number"

        },
        {
            name: "Name",
            type: "input",
            message: "What is name of product you would like to stock?"
        },
        {
            name: "Category",
            type: "input",
            message: "What is the category for product?"
        },
        {
            name: "Price",
            type: "input",
            message: "What is the price for item?"
        },
        {
            name: "Quantity",
            type: "input",
            message: "What is the quantity you would like to add?"
        },

    ]).then(function (answers) {
        var id = answers.ID;
        var name = answers.Name;
        var category = answers.Category;
        var price = answers.Price;
        var quantity = answers.Quantity;
        buildNewItem(id, name, category, price, quantity);
    });
};

// Building the new item to Add in MySql

function buildNewItem(id, name, category, price, quantity) {
    connection.query('INSERT INTO products (item_id,product_name,department_name,price,stock_quantity) VALUES("' + id + '","' + name + '","' + category + '",' + price + ',' + quantity + ')');
    displayInventory();
};
// Fuction to Remove an Item
function removeRequest() {
    inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "What is the item number of the item you would like to remove?"
    }]).then(function (answers) {
        var id = answers.ID;
        removeInventory(id);
    });
};

function removeInventory(id) {
    connection.query('DELETE FROM Products WHERE item_id = ' + id);
    displayInventory();
};

displayInventory();