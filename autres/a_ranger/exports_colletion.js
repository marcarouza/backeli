const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = mongoose.model('Employee', employeeSchema);

//!! POUR IMPORTER ON FAIT CECI
//!! const Employee = require('./path/to/file');

// on peut aussi faire
//?? Masquer la grille
//

//#####################################################################
