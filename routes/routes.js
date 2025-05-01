// routes.js
const express = require('express');
const routesControl = require('../controllers/routesControl');

const router = express.Router();

const {requireAuth, checkUser} = require('../middlewares/authMiddle');

// Middleware pour parser le User-Agent

//##                    CHECKS PREALABLES                          --

router.route('*').get(checkUser);

//## VERIF DES COOKIES
router.route('/api/checkCookies').get(routesControl.checkCookies);

//##                  Comportement utilisateur                           -

router.route('/api/info').get(routesControl.getInfo);

//##                    ROUTES API DEDIEES CELINE AZOURA                 --

// router.route('/api/sendMailChant').post(routesControl.contactFormChant);

//##                    ROUTES API MOT DE PASSE              --

router
	.route('/api/modifyPWD')
	.get(async (req, res) => {
		// Par exemple, retourner des informations sur la modification de mot de passe (cela peut être adapté)
		res.status(200).json({
			message: 'Utilisez POST pour changer votre mot de passe.',
		});
	})
	.post(routesControl.modifyPWD_post);

//##                    ROUTES API BLOG              --

router.route('/api/allPosts').get(routesControl.allPosts_get);

router.route('/api/addOnePost').post(routesControl.addOnePost_post);
router.route('/api/onePostById/:id').get(routesControl.OnePostById_get);

//##                    ROUTES FRIENDS              --

router.route('/api/askFor1Friend').post(routesControl.askFor1Friend_post);

router.route('/api/acceptFriendReq').post(routesControl.acceptFriendReq_post);

router.route('/api/rejectFriendReq').post(routesControl.rejectFriendReq_post);

router.route('/api/allMembers').get(routesControl.allMembers_get);

router
	.route('/signUserMAILConfirm')
	.post(routesControl.signUserMAILConfirm_post);

// Route pour obtenir l'état de l'utilisateur
router.route('/api/checkUserStatus').get(routesControl.checkUserStatus);

//?? ---  AFFICHAGE DU COOKIE JWT  ----------------

router.route('/api/getCookie').get(routesControl.apiGetCookie);

//?? ---  LOGOUT ()EFFACEMENT DU COOKIE JWT)  ----------------

// router.route('/logOutApi').get(routesControl.logOutApi);
router.route('/api/logOut').post(routesControl.logOutApi_post);

//?? ---  ENVOI POST PAR MAIL DU MESSAGE CONTACT ----------------

router.route('/api/contactFormPost').post(routesControl.contactForm_post);

//?? ---  ENVOI PAR MAIL DE CONFIRMATION INSCRIPTION  ----------------

router
	.route('/signUserMailConfirm')
	.post(routesControl.signUserMAILConfirm_post);

//##                    ENVOI DE MAILS                          --

router.route('/api/contactPage').get(routesControl.contact_get).post(routesControl.contactForm_post);

//##                    ACCES USER SCENARIOS                                  --

router.route('/api/logUserPage').get(routesControl.logUserPage_get).post(routesControl.logUserPage_post);

router.route('/api/signUserPage').get(routesControl.signPage_get).post(routesControl.signUser_post);


router.route('/api/logOut').get(routesControl.logOut_get);


//?? ---  ROUTE API & SERVEUR pour SignUserForm.vue  ----------------

// router.route('/api/signUser').post(routesControl.signUser_post);

//?? ---  ROUTE API & MODIFIER LE COMPTE   ----------------

https: router
	.route('/api/updateUser')
	.get(routesControl.updateUser_get)
	.post(routesControl.updateUser_post);


//##                    PAGES LIBRES                           ///       --

router.route('/cv').get(routesControl.cv_get);
router.route('/projets').get(routesControl.projets_get);
//

//##                    ROUTES BLOG                                  --

router.route('/blog').get(requireAuth, routesControl.blog_get);
// router.route('/allPosts').get(requireAuth, routesControl.allPosts_get);
router.route('/postWrite').get(requireAuth, routesControl.postWrite_get);
router.route('/postSearch').get(requireAuth, routesControl.postSearch_get);

//##                        ACCUEIL                                   --

router.route('/').get(routesControl.home_get).post(routesControl.home_post);

// router
// 	.route('/subdb')
// 	.get(routesControl.subdb_get)
// 	.post(routesControl.subdb_post);
//
router
	.route('/search')
	.get(routesControl.search_get)
	.post(routesControl.search_post);

// router.route('/del').get(routesControl.del_get).post(routesControl.del_post);
//
module.exports = router;