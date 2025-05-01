const Tail = require('tail').Tail;

const logFile = '/home/chemin_a_changer/vos_logs.log'; // Mettez ici le bon chemin

const tail = new Tail(logFile);

tail.on('line', (data) => {
	console.log('Nouvelle entrée dans le log:', data);
});

tail.on('error', (err) => {
	console.error('Erreur de lecture du log:', err);
});
