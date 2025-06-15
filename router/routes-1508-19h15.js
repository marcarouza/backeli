// routes.js
const express = require('express');
const routesControl = require('../controllers/routesControl');

const router = express.Router();

const {requireAuth, checkUser} = require('../middlewares/authMiddle');

//##                    CHECKS PREALABLES                          --

router.route('*').get(checkUser);

//##                    ROUTES API DEDIEES FRONT                 --

//##                    ROUTES FRIENDS              --

router.route('/askFor1Friend').post(routesControl.askFor1Friend_post);

router.route('/acceptFriendReq').post(routesControl.acceptFriendReq_post);

router.route('/allMembers').get(routesControl.allMembers_get);

router
	.route('/signUserMailConfirm')
	.post(routesControl.signUserMAILConfirm_post);

//?? ---  Pour obtenir l'état de l'utilisateur  DU COOKIE JWT  ----------------

router.route('/checkUserStatus').get(routesControl.checkUserStatus_get);

//?? ---  AFFICHAGE DU COOKIE JWT  ----------------

router.route('/getCookie').get(routesControl.apiGetCookie);

//?? ---  LOGOUT ()EFFACEMENT DU COOKIE JWT)  ----------------

router.route('/logOutApi').get(routesControl.logOutApi);

//?? ---  ENVOI POST PAR MAIL DU MESSAGE CONTACT ----------------

router.route('/api/contactFormPost').post(routesControl.contactForm_post);

//?? ---  ENVOI PAR MAIL DE CONFIRMATION INSCRIPTION  ----------------

router
	.route('/signUserMailConfirm')
	.post(routesControl.signUserMailConfirm_post);

//##                    ENVOI DE MAILS                          --

router.route('/contactForm').post(routesControl.contactForm_post);
router.route('/contact').get(routesControl.contact_get);

//##                    ACCES USER SCENARIOS                                  --

// router.route('/api/logUserPage').get(routesControl.logUserPage_get);
// router.route('/api/logUser').post(routesControl.logUser_post);

router
	.route('/api/logUserPage')
	.get(routesControl.logUserPage_get)
	.post(routesControl.logUser_post);

router.route('/api/signPage').get(routesControl.signPage_get).post(routesControl.signUser_post);

router.route('/api/logOut').get(routesControl.logOut_get);

//?? ---  ROUTE API & SERVEUR pour SignUserForm.vue  ----------------

router
	.route('/create_user')
	.get(routesControl.createUser_get)
	.post(routesControl.createUser_post);

// router
// 	.route('/createUserPage')
// 	.get(routesControl.createUserPage_get)
// 	.post(routesControl.createUserPage_post);

//?? ---  ROUTE API & MODIFIER LE COMPTE   ----------------

router
	.route('/modifyUserPage')
	.get(routesControl.modifyUser_get)
	.post(routesControl.modifyUser_post);

//##                    PAGES LIBRES                           ///       --

router.route('/cv').get(routesControl.cv_get);
router.route('/projets').get(routesControl.projets_get);
//

//##                    ROUTES BLOG                                  --

router.route('/blog').get(requireAuth, routesControl.blog_get);
router.route('/allPosts').get(requireAuth, routesControl.allPosts_get);
router.route('/postWrite').get(requireAuth, routesControl.postWrite_get);
router.route('/postSearch').get(requireAuth, routesControl.postSearch_get);

//##                        ACCUEIL                                   --

router.route('/').get(routesControl.home_get).post(routesControl.home_post);

router
	.route('/subdb')
	.get(routesControl.subdb_get)
	.post(routesControl.subdb_post);
//
router
	.route('/search')
	.get(routesControl.search_get)
	.post(routesControl.search_post);

router.route('/del').get(routesControl.del_get).post(routesControl.del_post);
//
router.route('/api/random-user').get(routesControl.randomUser_get);

module.exports = router;
