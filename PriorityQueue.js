function Node(data, priority, callback) {
	this.data = data;
	this.priority = priority;
	this.callback = callback;
  }
  
  function PriorityQueue() {
	this.items = [];
  }
  
  PriorityQueue.prototype.enqueue = function (data, priority, callback) {
	const newNode = new Node(data, priority, callback);
	let added = false;
  
	for (let i = 0; i < this.items.length; i++) {
	  if (this.items[i].priority > newNode.priority) {
		this.items.splice(i, 0, newNode);
		added = true;
		break;
	  }
	}
  
	if (!added) {
	  this.items.push(newNode);
	}
  };
  
  // This method will execute the element with the highest priority
  // and then it will remove it
  PriorityQueue.prototype.dequeue = function () {
	if (this.isEmpty()) {
	  return null;
	}
	const node = this.items.shift();
	node.callback();
	return node;
  };
  
  PriorityQueue.prototype.isEmpty = function () {
	return this.items.length === 0;
  };
  
  // This method will show the element with the highest priority
  PriorityQueue.prototype.peek = function () {
	if (this.isEmpty()) {
	  return null;
	}
	return this.items[0];
  };
  
  PriorityQueue.prototype.size = function () {
	return this.items.length;
  };
  
  const pq = new PriorityQueue();
  
  pq.enqueue("Some transition event here...", 2, () => console.log("Executing transition..."));
  pq.enqueue("Scroll Event", 3, () => console.log("Executing things on scroll "));
  pq.enqueue("Event with the highest priority like click - THIS IS URGENT", 1, () => console.log("Execute some task on click..."));
  
  pq.dequeue();
  pq.dequeue();
  pq.dequeue();