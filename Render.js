function performConcurrentWorkOnRoot(root) {
	// Simula la fase de render recorriendo el árbol de fibras
	workLoop(root);
  }
  
  function workLoop(fiber) {
	while (fiber) {
	  // Simula el trabajo de renderizado para cada fibra
	  console.log(`Rendering: ${fiber.type}`);
	  // Aquí se calcularían las actualizaciones necesarias para el DOM
	  // y se crearían nuevas fibras si es necesario
  
	  // Simula la interrupción y reanudación en modo concurrente
	  if (shouldYield()) {
		return;
	  }
  
	  fiber = fiber.sibling || fiber.child;
	}
  }
  
  function shouldYield() {
	// Simula la condición para dar el control al browser (interrupción del trabajo)
	return Math.random() < 0.5; // 50% de probabilidad de dar el control al browser
  }
  
  // Asi más o menos se ve una fibra, en su versión de objeto
  const rootFiber = {
	type: 'div',
	child: {
	  type: 'p',
	  sibling: {
		type: 'button',
	  },
	},
  };
  
  performConcurrentWorkOnRoot(rootFiber);