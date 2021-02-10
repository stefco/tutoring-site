function blockElementFromName(name, src=undefined, draggable=true) {
	var blockDefined = BLOCKS.includes(name);
	var reDefined = !(src === undefined);
	if (blockDefined && reDefined) {
		var msg = (
			"This block already exists, can't redefine: "+
			String(name)
		);
		//console.log(msg);
		throw msg;
	}
	if (!(blockDefined || reDefined)) {
		var msg = "Block type not defined: "+String(name);
		//console.log(msg);
		throw msg;
	}
	name = String(name);
	src = (src === undefined) ? (  /* default blocks */
		"../static/minecraft-icons/" + name +
		"_icon32.png"
	) : src;
	var domElement = document.createElement("img");
	domElement.classList.add("block");
	domElement.classList.add("block-" + name);
	domElement.name = name;
	domElement.src = src;
	domElement.dataset.draggable = draggable
	dragElement(domElement);
	//domElement.onclick = function(e){console.log("Clicked on block: ");
	//				 console.log(e);};
	return domElement;
}

class RecipeRegistry {
	constructor(recipes) {
		this.recipes = recipes
	}

	checkContents(contents) {
		var notFound = false;
		for (const blockName in this.recipes) {
			var recipe = this.recipes[blockName];
			for (var i = 0; i<contents.length; i++) {
				for (var j = 0; j<contents[i].length; j++) {
					if ((recipe[i] === undefined) || (recipe[i][j] !== contents[i][j])) {
						console.log(`breaking on ${i}, ${j} with ${recipe[i][j]} !== ${contents[i][j]}`);
						notFound = true;
						break;
					}
				}
				if (notFound) {
					break;
				}
			}
			if (notFound) {
				notFound = false;
			} else {
				return blockName;
			}
		}
		return null;
	}
}

function mouseupClosure(s, c) {
	return function(e) {
		var last = blockDragTracker.getLast()
		var modified = false;
		if (c.readonly) {
			blockDragTracker.setLast(null);
		} else if (last !== null) {
			var [row, col] = InventoryTable.indexOf(s)
			for (var i=0; i<last.classList.length; i++) {
				if ((c.block(row, col) === null) &&
					(last.classList[i] === 'block')) {
					c.addBlock(row, col, last);
					blockDragTracker.setLast(null);
					modified = true;
					break;
				}
			}
		}
		// TODO call observers in crafting table controller
	};
}

class InventoryTable {
	addBlock(row, col, block) {
		if (block.parentElement !== null) {
			block.parentElement.removeChild(block);
		}
		this.slot(row, col).appendChild(block);
	}

	constructor(rows, columns, readonly=false) {
		if (rows <= 0) {
			throw ("Must have a positive # of rows, not: " +
				String(rows));
		}
		if (columns <= 0) {
			throw ("Must have a positive # of columns, not: " +
				String(columns));
		}
		this.readonly = readonly;
		this.domElement = document.createElement("table");
		this.domElement.classList.add("inventory-table");
		this.domElement.controller = this;
		for (var i=0; i<rows; i++) {
			var r = document.createElement("tr");
			r.controller = this;
			this.domElement.appendChild(r);
			for (var j=0; j<columns; j++) {
				var d = document.createElement("td");
				var s = document.createElement("div");
				s.controller = this;
				s.classList.add("inventory-slot");
				d.appendChild(s);
				d.onmouseenter = mouseupClosure(s, this);
				r.appendChild(d);
			}
		}
	}

	get rows() {
		return this.domElement.childNodes.length;
	}

	get cols() {
		return this.domElement.childNodes[0].childNodes.length;
	}

	get contents() {
		var content = [];
		var rows = this.rows;
		var cols = this.cols;
		for (var i=0; i<rows; i++) {
			content[i] = []
			for (var j=0; j<cols; j++) {
				content[i][j] = this.block(i, j);
				if (content[i][j] !== null) {
					content[i][j] = content[i][j].name;
				}
			}
		}
		return content;
	}

	slot(row, col) {
		return this
			.domElement
			.childNodes[row]
			.childNodes[col]
			.childNodes[0];
	}

	static indexOf(slot) {
		var cell = slot.parentNode;
		var row = cell.parentNode;
		var cells = row.childNodes;
		var rows = row.parentNode.childNodes;
		for (var i = 0; i<rows.length; i++) {
			if (rows[i] === row) {
				for (var j = 0; j<cells.length; j++) {
					if (cells[j] === cell) {
						return [i, j];
					}
				}
			}
		}
		throw "Slot not found.";
	}

	block(row, col) {
		var slot = this.slot(row, col).childNodes;
		if (slot.length === 0) {
			return null;
		}
		return slot[0];
	}

	newBlock(row, col, name, src=undefined, draggable=true) {
		if (this.block(row, col) !== null) {
			throw ("Slot already filled: " + String(row) +
				", " + String(col));
		}
		this.addBlock(row, col, blockElementFromName(name, src, draggable));
	}
}

class CraftingTable {
	constructor(rows, columns, recipes={}) {
		// create elements
		this.input = new InventoryTable(rows, columns);
		this.output = new InventoryTable(1, 1, true);
		this.button = document.createElement("div");
		this.button.innerHTML = "Craft!";
		// register classes for styling
		this.input.domElement.classList.add("crafting-table-input");
		this.output.domElement.classList.add("crafting-table-output");
		this.button.classList.add("crafting-table-button");
		// register controllers
		this.input.controller = this;
		this.output.controller = this;
		this.button.controller = this;
		// TODO: check for invalid recipe sizes
		this.recipes = recipes;
		// make an arrow pointing from input to output
		var arrow = document.createElement("div");
		arrow.innerHTML = "&#8594;";
		// create the container for the crafting table and fill it
		var container = document.createElement("div");
		container.classList.add("crafting-table-container");
		container.appendChild(this.input.domElement);
		container.appendChild(arrow);
		container.appendChild(this.output.domElement);
		container.appendChild(this.button);
		// put everything in the crafting table
		this.domElement = document.createElement("div");
		this.domElement.classList.add("crafting-table");
		this.domElement.appendChild(container);
		// this.domElement.onmouseenter = function(e){
		// 	var output = this.recipes.checkContents(this.input.contents);
		// 	if (output !== null) {
		// 		var block = this.output.block(0,0);
		// 		if (block.parentElement !== null) {
		// 			block.parentElement.removeChild(block);
		// 		}
		// 		this.output.newBlock(0, 0, output);
		// 	}
		// }
	}
}
