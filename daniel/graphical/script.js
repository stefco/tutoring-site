var inventory = new InventoryTable(5, 10);
var craftingTable = new CraftingTable(3, 3);
document.querySelector("#inventory-table-div").appendChild(inventory.domElement);
document.querySelector("#crafting-table-div").appendChild(craftingTable.domElement);

// slot debug events
var slots = document.querySelectorAll(".inventory-slot");
// for (let i=0; i<slots.length; i++) {
//   let slot = slots[i];
//   slot.parentElement.onmouseenter = function(e) {
// 	  //console.log("Mouse enter from slot at index: ");
// 	  //console.log(slot);
// 	  //console.log(InventoryTable.indexOf(slot));
// 	  //console.log(e);
//   };
// }

// add some inventory
for (var i=0; i<30; i++) {
	inventory.newBlock(
		Math.floor(i/10),
		i%10,
		BLOCKS[Math.floor(Math.random()*BLOCKS.length)]
	)
}
