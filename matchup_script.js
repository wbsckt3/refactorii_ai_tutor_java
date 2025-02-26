window.onload = function () {
    // Función para cargar dinámicamente los códigos y conceptos desde JSON
    function cargarContenido(reto) {
        fetch('contenido.json')
            .then(response => response.json())
            .then(data => {
                const retoKey = `codesReto${reto}`;
                const content = data[retoKey];

                if (!content) {
                    console.error(`Reto ${reto} no encontrado en el JSON`);
                    return;
                }

                // Establecer el título del reto en un elemento h1
                const tituloReto = document.querySelector('h2');
                tituloReto.textContent = content.title || `Reto ${reto}`;
                
                // Limpiar el contenedor de códigos y conceptos anteriores
                const codesContainer = document.querySelector('.codes');
                const conceptsContainer = document.querySelector('.concepts');
                codesContainer.innerHTML = '';
                conceptsContainer.innerHTML = '';

                // Cargar los snippets de código
                content.codes.forEach(item => {
                    const codeDiv = document.createElement('div');
                    codeDiv.id = item.id;
                    codeDiv.className = 'code-snippet';
                    codeDiv.innerHTML = `<code>${item.code}</code>`;
                    codesContainer.appendChild(codeDiv);
                });

                // Cargar los conceptos
                content.concepts.forEach(item => {
                    const conceptDiv = document.createElement('div');
                    conceptDiv.id = item.id;
                    conceptDiv.className = 'droppable';
                    conceptDiv.textContent = item.description;
                    conceptsContainer.appendChild(conceptDiv);
                });

                // Configurar Sortable después de cargar el contenido
                iniciarSortable();
            })
            .catch(error => console.error('Error cargando el contenido:', error));
    }

    // Función para inicializar Sortable después de cargar el contenido dinámicamente
    function iniciarSortable() {
        const codesContainer = document.querySelector('.codes');

        // Crear Sortable para los bloques de código
        Sortable.create(codesContainer, {
            group: 'shared',
            animation: 150
        });

        // Crear Sortable para las descripciones de conceptos
        document.querySelectorAll('.droppable').forEach(function (concept) {
            Sortable.create(concept, {
                group: 'shared',
                animation: 150,
                ghostClass: 'sortable-ghost'
            });
        });
    }

    // Función para verificar si todas las respuestas fueron completadas
    function verificarCompletado() {
        const droppables = document.querySelectorAll('.droppable');
        let completado = true;
    
        droppables.forEach(droppable => {
            if (!droppable.querySelector('.code-snippet')) {
                completado = false;
            }
        });
    
        if (completado) {
            mostrarBotonesNavegacion();
            checkAnswers(); // Llama a checkAnswers después de completar
        }
    }

    // Función para mostrar los botones de "Reto anterior" y "Siguiente reto"
   function mostrarBotonesNavegacion() {
        const container = document.querySelector('.buttons-container');
        
        // Verificar si ya existen botones y eliminarlos
        const botonesExistentes = document.querySelectorAll('.boton-reto, .boton-reto-anterior');
        botonesExistentes.forEach(boton => boton.remove());
    
        // Obtener el texto del h1 actual para los botones
        const tituloActual = document.querySelector('h1').textContent;
    
        // Botón de "Reto anterior" (si no estamos en el primer reto)
        if (retoActual > 0) {
            const botonRetoAnterior = document.createElement('button');
            const tituloAnterior = `Reto ${retoActual}: ${tituloActual}`; // Título del reto anterior
            botonRetoAnterior.textContent = `< Reto anterior`;
            botonRetoAnterior.className = 'boton-reto-anterior';
    
            // Funcionalidad del botón de reto anterior
            botonRetoAnterior.addEventListener('click', function () {
                cargarContenido(--retoActual);
            });
    
            // Añadir el botón de "Reto anterior" al contenedor
            container.appendChild(botonRetoAnterior);
        }
    
        // Crear el botón para el siguiente reto
        const botonSiguienteReto = document.createElement('button');
        const tituloSiguiente = `Reto ${retoActual + 1}: ${tituloActual}`; // Título del siguiente reto
        botonSiguienteReto.textContent = `Siguiente reto >`;
        botonSiguienteReto.className = 'boton-reto';
    
        // Funcionalidad del botón de siguiente reto
        botonSiguienteReto.addEventListener('click', function () {
            cargarContenido(++retoActual);
        });
    
        // Añadir el botón de "Siguiente reto" al contenedor
        container.appendChild(botonSiguienteReto);
    }
            
    let retoActual = 1;

    // Agregar evento para verificar cuando se completan todos los elementos
    document.addEventListener('dragend', verificarCompletado);

    // Cargar el primer reto al cargar la página
    cargarContenido(retoActual);
});

 // Función para verificar las respuestas
   window.checkAnswers = function() {
            // Ajustar las respuestas correctas según el segundo reto (7 ítems)
    const correctAnswers = {
        concept1: "code1",  // Valor 1
        concept2: "code2",  // Valor 2
        concept3: "code3",  // Valor 3
        concept4: "code4",  // Valor 4
        concept5: "code5",  // Valor 5
        concept6: "code6",  // Valor 6
        concept7: "code7",   // Valor 7
        concept8: "code8",  // Conversión de tipo
        concept9: "code9",  // API de almacenamiento local
        concept10: "code10" // Salida en consola
    };

    let score = 0;
    let totalConcepts = Object.keys(correctAnswers).length;

    for (let concept in correctAnswers) {
        const conceptDiv = document.getElementById(concept);

        // Verificar si el conceptDiv existe
        if (!conceptDiv) {
            console.error(`No se encontró el elemento con ID ${concept}`);
            continue;  // Saltar este concepto si no se encuentra
        }

        const codeSnippet = conceptDiv.querySelector('.code-snippet');
        
        // Verificar si el codeSnippet existe y su ID es correcto
        if (codeSnippet && codeSnippet.id === correctAnswers[concept]) {
            score++;
        }
    }

    alert(`Tu puntuación es: ${score} de ${totalConcepts}`);
}
