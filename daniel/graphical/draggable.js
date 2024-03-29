var blockDragTracker = {
	last: null,
	getLast: function(){return this.last;},
	setLast: function(val){this.last = val;}
};

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
	if (e.target.dataset.draggable != "true") { return; }
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.zIndex = 11;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    //console.log("Mouse up from elmnt");
    //console.log(elmnt);
    elmnt.style.zIndex = null;
    elmnt.style.top = null;
    elmnt.style.left = null;
    document.onmouseup = null;
    document.onmousemove = null;
    blockDragTracker.setLast(elmnt);
    window.setTimeout(function(){
	    //console.log("Nullifying last dragged block...")
	    blockDragTracker.setLast(null);
    }, 10);
  }
}
