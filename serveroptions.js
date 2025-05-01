// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';

// Modules tiers
// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import useragent from 'express-useragent';

// Ajout du certificat SSL en local
// const https = require('https');
// const http = require('http');

const corsOptionsPROD = {
	origin: (origin, callback) => {
		console.log(`🔹 Vérification de l'origine : ${origin}`);
		if (!origin || allowedOriginsPROD.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('❌ Origine non autorisée par CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus: 200,
};

// 🔹 Option CORS secondaire
const corsOptions2 = {
	origin: true, // Ajustez selon votre front-end
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true, // Autorise les cookies
	optionsSuccessStatus: 200, // Optimisation pour certains navigateurs anciens
};

const allowedOrigins01 = [
	'https://eli-front-swjt.onrender.com',
	'https://eli-front.onrender.com',
	'http://localhost:3000',
	'https://back.eliazoura.fr',
	/192\.168\.3\.19:\d+$/, // Accepte l'adresse IP avec n'importe quel port
	/^http:\/\/localhost:\d+$/, // Autorise localhost avec n'importe quel port en HTTP
	/^https:\/\/localhost:\d+$/, // Idem en HTTPS
];


// Configuration CORS
const corsOptionsPROD = {
	origin: function (origin, callback) {
		const allowedOrigins = [
			'https://front.eliazoura.fr',
			'https://eli-front-swjt.onrender.com',
			'https://eli-front.onrender.com',
			'http://localhost:3000',
			'http://localhost:3500',
			'http://localhost:3001',
		];
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);1
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus: 200,
};

const corsOptions2 = {
	origin: true, // Ajustez selon l'origine de votre front-end
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true, // Permet l'envoi des cookies
	optionsSuccessStatus: 200, // Pour les navigateurs anciens comme IE11
};

const allowedOrigins01= [
	'https://eli-front-swjt.onrender.com',
	'https://eli-front.onrender.com',
	'http://localhost:3000',
	'https://back.eliazoura.fr',
	// 'http://localhost:8080',
	// 'http://localhost:4200',
	// 'http://192.168.0.73:8080',
	/192\.168\.3\.19:\d+$/, // Accepte l'adresse IP avec n'importe quel port
	/^http:\/\/localhost:\d+$/, // Accepte localhost avec n'importe quel port en HTTP
	/^https:\/\/localhost:\d+$/,

];
