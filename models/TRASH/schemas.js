const mongoose = require('mongoose');

const {userSchema} = require('./allSchemas');

//*********************************************************************

// Créer un modèle à partir du schéma
const lambdaModel = mongoose.model('lambda', userSchema);

module.exports = lambdaModel; // Exporter le modèle pour une utilisation dans d'autres fichiers
