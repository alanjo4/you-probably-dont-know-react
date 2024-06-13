function Nodo(valor) {
	this.valor = valor;
	this.hijo = null; // Primer hijo
	this.hermano = null; // Siguiente hermano
	this.padre = null; // Referencia al padre
	this.estado = 'pendiente'; // Estado del nodo: 'pendiente', 'procesando', 'completo'
  }
  
  Nodo.prototype.agregarHijo = function(nodoHijo) {
	nodoHijo.padre = this;
  
	if (this.hijo === null) {
	  this.hijo = nodoHijo;
	} else {
	  let ultimoHijo = this.hijo;
	  while (ultimoHijo.hermano !== null) {
		ultimoHijo = ultimoHijo.hermano;
	  }
	  ultimoHijo.hermano = nodoHijo;
	}
  };
  
  Nodo.prototype.imprimirArbolVisual = function(nivel = 0, esUltimo = true, prefijo = "") {
	const simbolo = this.estado === 'completo' ? '✔️' : (this.estado === 'procesando' ? '⏳' : '❌');
	const conector = esUltimo ? '└── ' : '├── ';
	console.log(`${prefijo}${conector}${simbolo} ${this.valor}`);
  
	const nuevoPrefijo = prefijo + (esUltimo ? '    ' : '│   ');
  
	let hijo = this.hijo;
	while (hijo) {
	  const esUltimoHijo = hijo.hermano === null;
	  hijo.imprimirArbolVisual(nivel + 1, esUltimoHijo, nuevoPrefijo);
	  hijo = hijo.hermano;
	}
  };
  
  Nodo.prototype.procesarArbol = function(callback) {
	const procesarNodo = (nodo) => {
	  if (!nodo) return;
  
	  nodo.estado = 'procesando';
	  console.log(`Procesando Nodo ${nodo.valor}`);
	  console.log("Estado actual del árbol:");
	  raiz.imprimirArbolVisual();
  
	  setTimeout(() => {
		if (nodo.hijo && nodo.hijo.estado !== 'completo') {
		  procesarNodo(nodo.hijo);
		} else {
		  nodo.estado = 'completo';
		  console.log(`Nodo completado ${nodo.valor}`);
		  console.log("Estado actual del árbol:");
		  raiz.imprimirArbolVisual();
  
		  if (nodo.hermano && nodo.hermano.estado !== 'completo') {
			procesarNodo(nodo.hermano);
		  } else {
			let padre = nodo.padre;
			while (padre) {
			  let allSiblingsComplete = true;
			  let sibling = padre.hijo;
			  while (sibling) {
				if (sibling.estado !== 'completo') {
				  allSiblingsComplete = false;
				  break;
				}
				sibling = sibling.hermano;
			  }
			  if (allSiblingsComplete) {
				padre.estado = 'completo';
				console.log(`Nodo completado ${padre.valor}`);
				console.log("Estado actual del árbol:");
				raiz.imprimirArbolVisual();
				padre = padre.padre;
			  } else {
				break;
			  }
			}
  
			let nextNode = nodo;
			while (nextNode && nextNode.estado === 'completo') {
			  if (nextNode.hermano && nextNode.hermano.estado !== 'completo') {
				nextNode = nextNode.hermano;
			  } else {
				nextNode = nextNode.padre;
			  }
			}
			if (nextNode && nextNode.estado !== 'completo') {
			  procesarNodo(nextNode);
			}
		  }
  
		  if (nodo === raiz && !nodo.hermano) {
			if (callback) callback();
		  }
		}
	  }, 1000); // Emula el trabajo asíncrono para procesar el nodo
	};
  
	procesarNodo(this);
  };
  
  const raiz = new Nodo('Raíz');
  const hijo1 = new Nodo('Hijo 1');
  const hijo2 = new Nodo('Hijo 2');
  const hijo3 = new Nodo('Hijo 3');
  
  raiz.agregarHijo(hijo1);
  raiz.agregarHijo(hijo2);
  raiz.agregarHijo(hijo3);
  
  const hijo11 = new Nodo('Hijo 1.1');
  const hijo12 = new Nodo('Hijo 1.2');
  hijo1.agregarHijo(hijo11);
  hijo1.agregarHijo(hijo12);
  
  const hijo21 = new Nodo('Hijo 2.1');
  hijo2.agregarHijo(hijo21);
  
  console.log("Árbol antes del procesamiento:");
  raiz.imprimirArbolVisual();
  
  raiz.procesarArbol(() => {
	console.log("Árbol después del procesamiento:");
	raiz.imprimirArbolVisual();
  });