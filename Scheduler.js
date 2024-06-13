function Scheduler() {
	this.taskQueue = [];
	this.currentTask = null;
	this.frameInterval = 5; // 5ms por tarea, esto es algo heurístico, pura probabilidad
	this.isMessageLoopRunning = false;
  }
  
  Scheduler.prototype.scheduleCallback = function (lanes, callback) {
	const currentTime = Date.now();
	const expirationTime = this.calculateExpirationTime(lanes, currentTime);
	const task = { callback, expirationTime, lanes };
	this.taskQueue.push(task);
	this.taskQueue.sort((a, b) => a.expirationTime - b.expirationTime);
	this.requestHostCallback();
  };
  
  Scheduler.prototype.calculateExpirationTime = function (lanes, currentTime) {
	if (lanes & 0b0001) return currentTime + 0; // IMMEDIATE_PRIORITY
	if (lanes & 0b0010) return currentTime + 250; // USER_BLOCKING_PRIORITY
	if (lanes & 0b0100) return currentTime + 5000; // NORMAL_PRIORITY
	if (lanes & 0b1000) return currentTime + 10000; // LOW_PRIORITY
	return currentTime + 10000; // Default: LOW_PRIORITY
  };
  
  Scheduler.prototype.requestHostCallback = function () {
	if (!this.isMessageLoopRunning) {
	  this.isMessageLoopRunning = true;
	  setTimeout(() => this.performWorkUntilDeadline(), 0);
	}
  };
  
  Scheduler.prototype.performWorkUntilDeadline = function () {
	const startTime = Date.now();
	while (this.taskQueue.length > 0) {
	  const currentTime = Date.now();
	  if (currentTime - startTime > this.frameInterval) {
		// El browser está ocupado, entonces le debemos ceder el control
		break;
	  }
	  this.currentTask = this.taskQueue.shift();
	  const continuationCallback = this.currentTask.callback(false);
	  if (typeof continuationCallback === 'function') {
		this.currentTask.callback = continuationCallback;
		this.taskQueue.push(this.currentTask);
		this.taskQueue.sort((a, b) => a.expirationTime - b.expirationTime);
	  }
	}
	this.isMessageLoopRunning = false;
  };

  const scheduler = new Scheduler();
  
	// Prioridades de tareas
  // Te dejo los numeros en decimal pero acordate que
  // a más chico el "carril" más prioritario es,
  // como el carril rápido de una autopista
  const IMMEDIATE_LANE = 0b0001;
  const USER_BLOCKING_LANE = 0b0010;
  const NORMAL_LANE = 0b0100;
  const LOW_LANE = 0b1000;
  
  scheduler.scheduleCallback(NORMAL_LANE, () => {
	console.log('Normal priority task executed');
	return null;
  });
  
  scheduler.scheduleCallback(USER_BLOCKING_LANE, () => {
	console.log('blocking user task executed');
	return null;
  });
  
  scheduler.scheduleCallback(IMMEDIATE_LANE, () => {
	console.log('inmediate task executed');
	return null;
  });