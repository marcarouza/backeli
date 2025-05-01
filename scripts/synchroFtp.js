const fs = require('fs');
const path = require('path');
const ftp = require('ftp');

// Paramètres de connexion FTP
const FTP_HOST = 'caracal.o2switch.net';
const FTP_USER = 'wzwa0352';
const FTP_PASS = 'YachaR#398@';
const LOCAL_DIR =
	'/Users/eliazoura/Library/CloudStorage/Dropbox/vsc2023/ifocop/STAGE/rendu_final/eli_front/dist';
const REMOTE_DIR = 'ftp://wzwa0352@caracal.o2switch.net/eliazoura.fr';

function syncFiles() {
	const client = new ftp.Client();

	client.on('ready', () => {
		client.cd(REMOTE_DIR, (err) => {
			if (err) {
				console.error(
					'Erreur lors du changement de répertoire distant :',
					err
				);
				client.end();
				return;
			}

			syncDirectory(LOCAL_DIR, '');

			client.end();
			console.log('Synchronisation terminée avec succès.');
		});
	});

	client.on('error', (err) => {
		console.error('Erreur de connexion FTP :', err);
		client.end();
	});

	client.connect({
		host: FTP_HOST,
		user: FTP_USER,
		password: FTP_PASS,
	});
}

function syncDirectory(localDir, remoteDir) {
	fs.readdir(localDir, (err, files) => {
		if (err) {
			console.error(
				'Erreur lors de la lecture du répertoire local :',
				err
			);
			return;
		}

		files.forEach((file) => {
			const localPath = path.join(localDir, file);
			const remotePath = path.join(remoteDir, file);

			fs.stat(localPath, (err, stats) => {
				if (err) {
					console.error(
						'Erreur lors de la récupération des informations du fichier local :',
						err
					);
					return;
				}

				if (stats.isDirectory()) {
					syncDirectory(localPath, remotePath);
				} else {
					uploadFile(localPath, remotePath);
				}
			});
		});
	});
}

function uploadFile(localPath, remotePath) {
	console.log(`Synchronisation de ${localPath} vers ${remotePath}`);

	client.put(localPath, remotePath, (err) => {
		if (err) {
			console.error('Erreur lors du téléchargement du fichier :', err);
		}
	});
}

function uploadFileUpdated(localPath, remotePath) {
	client.stat(remotePath, (err, stats) => {
		if (err) {
			// Le fichier n'existe probablement pas sur le serveur, on le téléverse
			console.log(`Téléversement de ${localPath} vers ${remotePath}`);
			client.put(localPath, remotePath, handleError);
		} else {
			// Le fichier existe, on compare les dates de modification
			fs.stat(localPath, (err, localStats) => {
				if (err) {
					console.error(
						`Erreur lors de la lecture des stats locales pour ${localPath}:`,
						err
					);
					return;
				}
				if (localStats.mtime > stats.mtime) {
					console.log(
						`Mise à jour de ${localPath} vers ${remotePath}`
					);
					client.put(localPath, remotePath, handleError);
				} else {
					console.log(
						`${localPath} est à jour, pas de téléversement nécessaire`
					);
				}
			});
		}
	});
}

function handleError(err) {
	if (err) console.error('Erreur lors du téléversement :', err);
}

syncFiles();
