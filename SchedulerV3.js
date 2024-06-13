function Scheduler() {
	this.taskQueue = [];
	this.timerQueue = [];
	this.isMessageLoopRunning = false;
	this.isHostCallbackScheduled = false;
	this.isPerformingWork = false;
	this.taskIdCounter = 0;
	this.channel = new MessageChannel();
	this.channel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
  }
  
  Scheduler.prototype.getCurrentTime = function() {
	return performance.now();
  };
  
  Scheduler.prototype.scheduleCallback = function(priorityLevel, callback, options) {
	const currentTime = this.getCurrentTime();
	let startTime;
  
	if (typeof options === 'object' && options !== null) {
	  const delay = options.delay;
	  if (typeof delay === 'number' && delay > 0) {
		startTime = currentTime + delay;
	  } else {
		startTime = currentTime;
	  }
	} else {
	  startTime = currentTime;
	}
  
	let timeout;
  
	switch (priorityLevel) {
	  case ImmediatePriority:
		timeout = IMMEDIATE_PRIORITY_TIMEOUT;
		break;
	  case UserBlockingPriority:
		timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
		break;
	  case IdlePriority:
		timeout = IDLE_PRIORITY_TIMEOUT;
		break;
	  case LowPriority:
		timeout = LOW_PRIORITY_TIMEOUT;
		break;
	  case NormalPriority:
	  default:
		timeout = NORMAL_PRIORITY_TIMEOUT;
		break;
	}
  
	const expirationTime = startTime + timeout;
	const newTask = {
	  id: this.taskIdCounter++,
	  callback: callback,
	  priorityLevel: priorityLevel,
	  startTime: startTime,
	  expirationTime: expirationTime,
	  sortIndex: -1
	};
  
	if (startTime > currentTime) {
	  newTask.sortIndex = startTime;
	  this.push(this.timerQueue, newTask);
	  if (this.peek(this.taskQueue) === null && newTask === this.peek(this.timerQueue)) {
		if (this.isHostTimeoutScheduled) {
		  this.cancelHostTimeout();
		} else {
		  this.isHostTimeoutScheduled = true;
		}
		this.requestHostTimeout(this.handleTimeout.bind(this), startTime - currentTime);
	  }
	} else {
	  newTask.sortIndex = expirationTime;
	  this.push(this.taskQueue, newTask);
	  if (!this.isHostCallbackScheduled && !this.isPerformingWork) {
		this.isHostCallbackScheduled = true;
		this.requestHostCallback(this.flushWork.bind(this));
	  }
	}
  
	return newTask;
  };
  
  Scheduler.prototype.push = function(queue, task) {
	queue.push(task);
	queue.sort((a, b) => a.sortIndex - b.sortIndex);
  };
  
  Scheduler.prototype.peek = function(queue) {
	return queue.length === 0 ? null : queue[0];
  };
  
  Scheduler.prototype.pop = function(queue) {
	return queue.shift();
  };
  
  Scheduler.prototype.requestHostTimeout = function(callback, ms) {
	setTimeout(callback, ms);
  };
  
  Scheduler.prototype.requestHostCallback = function(callback) {
	this.channel.port2.postMessage(null);
  };
  
  Scheduler.prototype.cancelHostTimeout = function() {
  };
  
  Scheduler.prototype.handleTimeout = function() {
	this.isHostTimeoutScheduled = false;
	this.flushWork();
  };
  
  Scheduler.prototype.flushWork = function() {
	if (this.isPerformingWork) {
	  return;
	}
	this.isPerformingWork = true;
	try {
	  this.performWorkUntilDeadline();
	} finally {
	  this.isPerformingWork = false;
	}
  };
  
  Scheduler.prototype.performWorkUntilDeadline = function() {
	let currentTime = this.getCurrentTime();
	let currentTask = this.peek(this.taskQueue);
  
	while (currentTask !== null) {
	  if (currentTask.expirationTime > currentTime && this.shouldYieldToHost()) {
		break;
	  }
  
	  const callback = currentTask.callback;
	  if (typeof callback === 'function') {
		currentTask.callback = null;
		const continuationCallback = callback(currentTask.expirationTime <= currentTime);
		currentTime = this.getCurrentTime();
		if (typeof continuationCallback === 'function') {
		  currentTask.callback = continuationCallback;
		} else {
		  if (currentTask === this.peek(this.taskQueue)) {
			this.pop(this.taskQueue);
		  }
		}
	  } else {
		this.pop(this.taskQueue);
	  }
	  currentTask = this.peek(this.taskQueue);
	}
  
	if (currentTask !== null) {
	  return true;
	} else {
	  const firstTimer = this.peek(this.timerQueue);
	  if (firstTimer !== null) {
		this.requestHostTimeout(this.handleTimeout.bind(this), firstTimer.startTime - currentTime);
	  }
	  return false;
	}
  };
  
  Scheduler.prototype.shouldYieldToHost = function() {
	return false;
  };
  
  // Prioridades de tareas
  // Te dejo los numeros en decimal pero acordate que
  // a más chico el "carril" más prioritario es,
  // como el carril rápido de una autopista
  const ImmediatePriority = 0b0001; // 1 en binario
  const UserBlockingPriority = 0b0010; // 2 en binario
  const NormalPriority = 0b0011; // 3 en binario
  const LowPriority = 0b0100; // 4 en binario
  const IdlePriority = 0b0101; // 5 en binario
  
  // Timeouts asociados a cada prioridad
  const IMMEDIATE_PRIORITY_TIMEOUT = 0;
  const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
  const NORMAL_PRIORITY_TIMEOUT = 5000;
  const LOW_PRIORITY_TIMEOUT = 10000;
  const IDLE_PRIORITY_TIMEOUT = Number.MAX_SAFE_INTEGER;
  
  const scheduler = new Scheduler();
  
  // Tareas con diferentes prioridades
  scheduler.scheduleCallback(ImmediatePriority, () => {
	console.log('Immediate priority task executed');
  });
  
  scheduler.scheduleCallback(UserBlockingPriority, () => {
	console.log('User blocking priority task executed');
  });
  
  scheduler.scheduleCallback(NormalPriority, () => {
	console.log('Normal priority task executed');
  });
  
  scheduler.scheduleCallback(LowPriority, () => {
	console.log('Low priority task executed');
  });
  
  scheduler.scheduleCallback(IdlePriority, () => {
	console.log('Idle priority task executed');
  });