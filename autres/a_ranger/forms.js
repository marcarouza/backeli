const express = require("express");
const app = express();
const router = require("express").Router();
//
app.post("/register", async (req, res) => {
	try {
		const hashPass = await bCrypt.hash(req.body.password, 10);
		if (email && password && username) {
			const user = users.find((user) => user.email === email);
			const timestamp = Date.now();
			const now = new Date(timestamp);
			const dateLisible = now.toLocaleString();
			users.push({
				when: Date.now().toString(),
				id: when.replace(/\s/g, ""),
				username: req.body.username,
				email: req.body.email,
				password: hashPass,
			});
			res.redirect("conlog/ok");
		} else {
			//res.render("conlog/nook");
			alert(
				"Cet e-mail est déjà utilisé, veuillez en chsoiri un autre ou demander la réinitialisation de mot de passe"
			);
		}
	} catch (error) {
		console.log(error);
	}
});
