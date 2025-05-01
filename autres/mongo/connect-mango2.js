import "dotenv/config";

import express from "express";
import nodePath from "node:path";

//import {fileURLToPath} from "node:url";

//
// Importation du module Express et package
const express = require("express");
// Création d'une instance d'Express
const app = express();
//const lodash = require("lodash");
const ejs = require("ejs");
// Définition du moteur de modèle EJS
app.set("view engine", "ejs");
const morgan = require("morgan");
//
const favicon = require("serve-favicon");
//
const PORT = String(process.env.PORT);
const HOST = String(process.env.HOST);
//const _filename = fileURLToPath(import.meta.url);
const _dirname = nodePath.dirname(_filename);

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "monProjetMongo";
MongoClient.connect(url, function (err, client) {
	console.log("Connecté à MongoDB");
	const db = client.db(dbName);
	client.close();
});
//
const createStudent = async (object) => {
	const collection = db.collection("students");
	const student = await collection.insertOne(object);
	return student;
};
const newStudent = {name: "eli azoura", status: "étudiant"};
const insertStudent = await createStudent(newStudent);
console.log(newStudent);
//
//
// Écoute du serveur sur le port 3000
const port = 3000;
app.listen(port, () => {
	console.log("Server is running on http://localhost : " + port);
});
