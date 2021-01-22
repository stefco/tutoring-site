var inventoryTableDiv = document.querySelector("#inventory-table-div");
var craftingTableDiv = document.querySelector("#crafting-table-div");

class InventoryTable {
	constructor(rows, columns, id="", readonly=false) {
		this.rows = rows;
		this.cols = columns;
		this.readonly = readonly;
		this.domElement = document.createElement("table");
		this.domElement.id = id;
		this.domElement.classList.add("inventory-table");
		this.virtTable = [];
		for (var i=0; i<this.rows; i++) {
			var r = document.createElement("tr");
			r.id = id + "-" + String(i);
			this.domElement.appendChild(r);
			this.virtTable[i] = [];
			for (var j=0; j<this.cols; j++) {
				var d = document.createElement("td");
				d.id = r.id + "-" + String(j);
				d.classList.add("inventory-slot");
				r.appendChild(d);
				this.virtTable[i][j] = d;
			}
		}
	}
}

class CraftingTable {
	constructor(rows, columns, recipes={}, id="") {
		this.id = id;
		this.input = new InventoryTable(rows, columns);
		this.input.domElement.classList.add("crafting-table-input");
		this.output = new InventoryTable(1, 1, "", true);
		this.input.domElement.classList.add("crafting-table-output");
		// TODO: check for invalid recipe sizes
		this.recipes = recipes;
		var arrow = document.createElement("div");
		arrow.innerHTML = "&#8594;";
		var container = document.createElement("div");
		container.classList.add("crafting-table-container");
		container.appendChild(this.input.domElement);
		container.appendChild(arrow);
		container.appendChild(this.output.domElement);
		this.domElement = document.createElement("div");
		this.domElement.classList.add("crafting-table");
		this.domElement.appendChild(container);
	}
}

var inventory = new InventoryTable(5, 10, "inventory-table");
var craftingTable = new CraftingTable(3, 3, id="crafting-table");
inventoryTableDiv.appendChild(inventory.domElement);
craftingTableDiv.appendChild(craftingTable.domElement);
