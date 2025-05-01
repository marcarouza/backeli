//!! Dans ExpressJS, une requête HTTP contient plusieurs objets qui permettent d'accéder aux différentes parties de la requête. Voici les principaux objets :
//##
//?? req.body : contient les données envoyées dans le corps de la requête.Cet objet est généralement utilisé pour les requêtes HTTP POST et PUT qui envoient des données au serveur.                           Pour utiliser req.body, vous devez utiliser un middleware comme express.json() ou express.urlencoded() pour parser les données envoyées dans le corps de la requête.
//##
//?? req.query : contient les paramètres de requête envoyés dans l'URL. Les paramètres de requête sont généralement utilisés pour filtrer ou trier les résultats d'une requête. Par exemple, http://localhost:3000/users?page=1&limit=10 contient les paramètres de requête page et limit.
//##
//?? req.params : contient les paramètres de route.Les paramètres de route sont utilisés pour capturer des parties de l'URL et les utiliser dans la route. Par exemple, http://localhost:3000/users/123 contient le paramètre de route id avec la valeur 123.
//## req.body, req.query, req.params, req.cookies, req.ip, req.method, req.path, req.protocol, req.hostname, req.originalUrl, req.headers, req.secure, req.signedCookies, req.stale, req.fresh, req.subdomains, req.xhr, req.route, req.params, req.query, req.body, req.files, req.app, req.cookies, req.signedCookies, req.originalUrl, req.get, req.is, req.accepts, req.acceptsCharsets, req.acceptsEncodings, req
//?? req.headers : contient les en-têtes HTTP de la requête. Les en-têtes HTTP sont utilisés pour fournir des informations supplémentaires sur la requête, telles que le type de contenu, la langue, etc.
//##
//?? req.cookies : contient les cookies envoyés avec la requête. Les cookies sont utilisés pour stocker des informations sur le client et les envoyer avec chaque requête.
//##
//?? req.ip : contient l'adresse IP du client qui a envoyé la requête.
//##
//?? req.method : contient la méthode HTTP de la requête(par exemple, GET, POST, PUT, DELETE, etc.).
//##
//?? req.path : contient le chemin d'accès de la requête (par exemple, /users, /posts/123, etc.).
//##
//?? req.protocol : contient le protocole HTTP utilisé pour la requête (par exemple, http ou https).

/*
req.body : contient les données envoyées dans le corps de la requête. Cet objet est généralement utilisé pour les requêtes HTTP POST et PUT qui envoient des données au serveur. Pour utiliser req.body, vous devez utiliser un middleware comme express.json() ou express.urlencoded() pour parser les données envoyées dans le corps de la requête.

req.query : contient les paramètres de requête envoyés dans l'URL. Les paramètres de requête sont généralement utilisés pour filtrer ou trier les résultats d'une requête. Par exemple, http://localhost:3000/users?page=1&limit=10 contient les paramètres de requête page et limit.

req.params : contient les paramètres de route. Les paramètres de route sont utilisés pour capturer des parties de l'URL et les utiliser dans la route. Par exemple, http://localhost:3000/users/123 contient le paramètre de route id avec la valeur 123.
req.cookies : contient les cookies envoyés avec la requête. Les cookies sont utilisés pour stocker des informations sur le client et les envoyer avec chaque requête.
req.ip : contient l'adresse IP du client qui a envoyé la requête.

req.method : contient la méthode HTTP de la requête (par exemple, GET, POST, PUT, DELETE, etc.).

req.path : contient le chemin d'accès de la requête (par exemple, /users, /posts/123, etc.).

req.protocol : contient le protocole HTTP utilisé pour la requête (par exemple, http ou https).

req.hostname : contient le nom d'hôte du serveur qui a reçu la requête.
req.originalUrl : contient l'URL originale de la requête, y compris la chaîne de requête.

req.headers : contient les en-têtes HTTP de la requête. Les en-têtes HTTP sont utilisés pour fournir des informations supplémentaires sur la requête, telles que le type de contenu, la langue, etc.
req.secure : contient une valeur booléenne indiquant si la requête a été envoyée via HTTPS.

req.signedCookies : contient les cookies signés envoyés avec la requête. Les cookies signés sont utilisés pour vérifier l'intégrité des données stockées dans les cookies.

req.stale : contient une valeur booléenne indiquant si la requête est obsolète.

req.fresh : contient une valeur booléenne indiquant si la requête est fraîche.

req.subdomains : contient un tableau de sous-domaines de l'URL de la requête.

req.xhr : contient une valeur booléenne indiquant si la requête a été envoyée via XMLHttpRequest.

req.route : contient l'objet de route correspondant à la requête.

req.files : contient les fichiers envoyés avec la requête. Pour utiliser req.files, vous devez utiliser un middleware comme multer pour gérer les téléchargements de fichiers.

req.app : contient une référence à l'application ExpressJS.

req.get(header) : renvoie la valeur de l'en-tête HTTP spécifié.

req.is(type) : renvoie une valeur booléenne indiquant si le type de contenu de la requête correspond au type spécifié.

req.accepts(types) : renvoie le premier type de contenu accepté par le client qui correspond aux types spécifiés.

req.acceptsCharsets(charsets) : renvoie le premier jeu de caractères accepté par le client qui correspond aux jeux de caractères spécifiés.

req.acceptsEncodings(encodings) : renvoie le premier encodage accepté par le client qui correspond aux encodages spécifiés.


*/
