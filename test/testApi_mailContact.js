const request = require('supertest');
const app = require('./app'); // Votre application Express

describe('POST /api/mailContact', () => {
	it('should respond with 200 and the expected JSON', async () => {
		const response = await request(app)
			.post('/api/mailContact')
			.send({
				firstname: 'Alice',
				lastname: 'Dupont',
				email: 'alice@example.com',
				code: '+33',
				mobile: '0123456789',
				subject: 'Test',
				message: 'Ceci est un test Bonjour, voici un message pour faire un essai denvoi et enfin savoir si ce message sera envoyé finalement pour vérifier que ma page de contacts fonctionne correctement en espérant que tout ceci fasse au moins 150 caractère ou SIGNES.',
			})
			.set('Accept', 'application/json');

		expect(response.status).toBe(200); // ou le code attendu
		expect(response.body).toHaveProperty('response'); // ou la propriété attendue
	});
});
