// script.js

// Definimos los diferentes puzzles disponibles
const puzzles = [
	{
		words:['ULL', 'COMPTE','VIGILA','ALERTA','CONTE','RONDALLA','GESTA','LLEGENDA',COMPTA', 'LLIURA', 'ENCOMANA', 'DONA', 'COMTE', 'FETA', 'MATO', 'MAO'],
		groups: {
			group1: { words: ['ULL', 'COMPTE','VIGILA','ALERTA'], difficulty: 'very-easy-group', label: 'EP!' },
           		group2: { words: ['CONTE','RONDALLA','GESTA','LLEGENDA'], difficulty: 'easy-group', label: 'HISTÒRIA' },
            		group3: { words: [COMPTA', 'LLIURA', 'ENCOMANA', 'DONA'], difficulty: 'medium-group', label: 'CONFIA' },
            		group4: { words: ['COMTE', 'FETA', 'MATO', 'MAO'], difficulty: 'hard-group', label: 'FORMATGES SENSE ACCENT' }
        		}
    	},

    	{
		
        	words: ['SARGANTANA', 'IGUANA', 'TORTUGA', 'CAMALEÓ', 'TÒTIL', 'GAMARÚS', 'ASE', 'LLUÇ', 'FALCÓ', 'GAT', 'XACAL', 'IBIS', 'MUSSOL', 'MOSTELA', 'LLEBRE', 'GIRAFA'],
        	groups: {
            		group1: { words: ['SARGANTANA', 'IGUANA', 'TORTUGA', 'CAMALEÓ'], difficulty: 'very-easy-group', label: 'RÈPTILS' },
           		group2: { words: ['TÒTIL', 'GAMARÚS', 'ASE', 'LLUÇ'], difficulty: 'easy-group', label: 'NO GAIRE ESPAVILAT' },
            		group3: { words: ['FALCÓ', 'GAT', 'XACAL', 'IBIS'], difficulty: 'medium-group', label: 'REPRESENTACIONS DE DÉUS EGIPCIS' },
            		group4: { words: ['MUSSOL', 'MOSTELA', 'LLEBRE', 'GIRAFA'], difficulty: 'hard-group', label: 'ACABATS EN NOTA MUSICAL' }
        }
   	}

    // Más puzzles aquí
];

// Función para obtener un índice único para seleccionar un puzzle basándonos en la fecha actual
function getPuzzleIndex() {
    const date = new Date();
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dayOfYear % puzzles.length;
}

// Seleccionar el puzzle correspondiente al día
const puzzle = puzzles[getPuzzleIndex()];
const words = puzzle.words;
const groups = puzzle.groups;

document.addEventListener('DOMContentLoaded', () => {

    const board = document.getElementById('board');

    const groupContainer = document.getElementById('group-container');

    const livesContainer = document.getElementById('lives-container');

    let selectedCells = [];

    let lives = 4;



    // Crear celdas aleatorias

    words.sort(() => Math.random() - 0.5);

    words.forEach(word => {

        const cell = document.createElement('div');

        cell.className = 'cell';

        cell.textContent = word;

        cell.onclick = () => handleClick(cell);

        board.appendChild(cell);

    });



    // Manejar clic en celdas

    function handleClick(cell) {

        if (cell.classList.contains('selected')) {

            cell.classList.remove('selected');

            selectedCells = selectedCells.filter(c => c !== cell);

        } else if (selectedCells.length < 4) {

            cell.classList.add('selected');

            selectedCells.push(cell);

        }

    }



    // Verificar selección

    document.getElementById('check-button').onclick = () => {

        if (selectedCells.length === 4) {

            const selectedWords = selectedCells.map(c => c.textContent);

            const group = Object.entries(groups).find(([key, value]) =>

                value.words.every(v => selectedWords.includes(v)) && selectedWords.every(v => value.words.includes(v))

            );



            if (group) {
				
				// Crear grupo acertado con su color de dificultad
				const groupElement = document.createElement('div');
				groupElement.className = `group ${group[1].difficulty}`;

				// Crear y añadir el título del grupo
				const groupTitle = document.createElement('h3');
				groupTitle.textContent = group[1].label;
				groupElement.appendChild(groupTitle);
				
				// Crear y añadir la lista de palabras del grupo
				const groupWords = document.createElement('p');
				groupWords.textContent = group[1].words.join(', ');
				groupElement.appendChild(groupWords);
				groupContainer.appendChild(groupElement);
				
				// Ocultar las celdas seleccionadas
				selectedCells.forEach(cell => cell.classList.add('hidden'));
				selectedCells = []; // Limpiar selección después de añadir el grupo


            } else {

                // Verificar si al menos 3 de las palabras pertenecen al mismo grupo

                const partialGroup = Object.entries(groups).find(([key, value]) => {

                    const matchingWords = value.words.filter(v => selectedWords.includes(v));

                    return matchingWords.length === 3;

                });



                lives--;

                updateLives();



                if (lives === 0) {

                    alert('Llàstima, intenta-ho demà');
					showRemainingGroups();
                    disableGame();

                } else if (partialGroup) {

                    alert("Te'n falta una");

                } else {

                    ;

                }

            }

            selectedCells = [];

            document.querySelectorAll('.cell.selected').forEach(cell => cell.classList.remove('selected'));

        } else {

            alert('Selecciona exactament 4 paraules.');

        }

    };
	
// Función para calcular el tiempo restante hasta el próximo puzzle (medianoche)
function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diff = tomorrow - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown-timer').textContent = `Temps fins al següent trencaclosques: ${hours}h ${minutes}m ${seconds}s`;

    // Actualizar cada segundo
    setTimeout(updateCountdown, 1000);
}

// Llamamos a la función al cargar la página
updateCountdown();

document.getElementById('shuffle-button').onclick = () => {
    const board = document.getElementById('board');
    const cells = Array.from(board.getElementsByClassName('cell')).filter(cell => !cell.classList.contains('hidden'));
    const words = cells.map(cell => cell.textContent);
    
    // Reordena las palabras no acertadas aleatoriamente
    words.sort(() => Math.random() - 0.5);

    // Actualiza el contenido de las celdas no acertadas
    cells.forEach((cell, index) => {
        cell.textContent = words[index];
        cell.classList.remove('selected'); // Elimina la selección al reordenar
    });
    selectedCells = []; // Limpia la selección actual
};

document.getElementById('deselect-button').onclick = () => {
    // Deselecciona todas las celdas seleccionadas
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
};


    // Actualizar visualmente las vidas

    function updateLives() {

        const livesElements = livesContainer.getElementsByClassName('life');

        if (livesElements.length > 0) {

            livesContainer.removeChild(livesElements[livesElements.length - 1]);

        }

    }



    // Deshabilitar el juego si se acaban las vidas

    function disableGame() {

        document.querySelectorAll('.cell').forEach(cell => {

            cell.onclick = null;

        });

        document.getElementById('check-button').disabled = true;

    }

});
