function commitRoot(root) {
	// Aplica las actualizaciones al DOM
	commitMutationEffects(root);
  
	// Procesa efectos secundarios pasivos
	flushPassiveEffects();
  
	// Procesa efectos de disposición
	commitLayoutEffects(root);
  
	console.log('Commit phase completed');
  }
  
  function commitMutationEffects(fiber) {
	while (fiber) {
	  console.log(`Updating DOM for: ${fiber.type}`);
	  // Aquí se aplicarían las actualizaciones al DOM
	  fiber = fiber.sibling || fiber.child;
	}
  }
  
  function flushPassiveEffects() {
	console.log('Flushing passive effects');
	// Aquí se ejecutarían los efectos pasivos, como useEffect
  }
  
  function commitLayoutEffects(fiber) {
	while (fiber) {
	  console.log(`Processing layout effects for: ${fiber.type}`);
	  // Aquí se aplicarían los efectos de disposición, como useLayoutEffect
	  fiber = fiber.sibling || fiber.child;
	}
  }
  
  const rootFiber = {
	type: 'div',
	child: {
	  type: 'p',
	  sibling: {
		type: 'button',
	  },
	},
  };
  
  commitRoot(rootFiber);