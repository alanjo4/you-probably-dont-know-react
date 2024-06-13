function isBrowserBusy(callback) {
    const startTime = performance.now();
	// React usa la API de MessageChannel en realidad...
    setTimeout(() => {
        const endTime = performance.now();
        // heuristica -> probabilidad
        const elapsedTime = endTime - startTime;
        callback(elapsedTime > 50); 
    }, 0);
}

isBrowserBusy((isBusy) => {
    if (isBusy) {
        console.log("El navegador está ocupado.");
    } else {
        console.log("El navegador no está ocupado.");
    }
});

/**
 * Método por sobrecarga del CPU
 * 
 * function isBrowserBusy(callback) {
    const startTime = performance.now();
    
    // Ejecutamos una tarea que tome mucho computo (por lo tanto se carga el CPU)
    for (let i = 0; i < 1000000; i++) {}
    
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    callback(elapsedTime > 100); // Si el tiempo es mayor a 100ms, el browser debe estar ocupado
}

// Uso
isBrowserBusy((isBusy) => {
    if (isBusy) {
        console.log("El navegador está ocupado.");
    } else {
        console.log("El navegador no está ocupado.");
    }
});
 */