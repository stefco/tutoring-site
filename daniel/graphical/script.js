var inventory = new InventoryTable(5, 10);
var craftingTable = new CraftingTable(3, 3);
document.querySelector("#inventory-table-div").appendChild(inventory.domElement);
document.querySelector("#crafting-table-div").appendChild(craftingTable.domElement);
