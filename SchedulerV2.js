const { performance } = require('perf_hooks');
const { MessageChannel } = require('worker_threads');

// Función constructora Scheduler
function Scheduler() {
	this.taskQueue = [];
	this.isMessageLoopRunning = false;
	this.channel = new MessageChannel();
	this.channel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
  }
  

  Scheduler.prototype.scheduleCallback = function(priority, callback) {
	this.taskQueue.push({ priority, callback });
	this.taskQueue.sort((a, b) => a.priority - b.priority);
	if (!this.isMessageLoopRunning) {
	  this.isMessageLoopRunning = true;
	  this.schedulePerformWork();
	}
  };
  
  Scheduler.prototype.schedulePerformWork = function() {
	if (typeof requestIdleCallback === 'function') {
	  requestIdleCallback(this.performWorkUntilDeadline.bind(this));
	} else {
	  this.channel.port2.postMessage(null);
	}
  };
  
  Scheduler.prototype.performWorkUntilDeadline = function(deadline) {
	let currentTask = this.taskQueue.shift();
	const startTime = performance.now();
	const timeSlice = 5; // Un valor heurístico en ms, de nuevo, pura probabilidad
  
	while (currentTask) {
	  if (this.shouldYield(startTime, deadline, timeSlice)) {
		this.taskQueue.unshift(currentTask);
		this.schedulePerformWork();
		return;
	  }
	  currentTask.callback();
	  currentTask = this.taskQueue.shift();
	}
  
	this.isMessageLoopRunning = false;
  };
  
  // Método para determinar si se debe ceder el control al navegador
  Scheduler.prototype.shouldYield = function(startTime, deadline, timeSlice) {
	if (typeof deadline === 'object' && typeof deadline.timeRemaining === 'function') {
	  return deadline.timeRemaining() <= 0;
	}
	return (performance.now() - startTime) >= timeSlice;
  };
  
 // Prioridades de tareas
  // Te dejo los numeros en decimal pero acordate que
  // a más chico el "carril" más prioritario es,
  // como el carril rápido de una autopista
  const HIGH_PRIORITY = 0b001; // 1 en binario
  const NORMAL_PRIORITY = 0b010; // 2 en binario
  const LOW_PRIORITY = 0b100; // 4 en binario
  
  const scheduler = new Scheduler();
  
  // Tareas con diferentes prioridades
  scheduler.scheduleCallback(HIGH_PRIORITY, () => {
	console.log('High priority task executed');
  });
  
  scheduler.scheduleCallback(NORMAL_PRIORITY, () => {
	console.log('Normal priority task executed');
  });
  
  scheduler.scheduleCallback(LOW_PRIORITY, () => {
	console.log('Low priority task executed');
  });