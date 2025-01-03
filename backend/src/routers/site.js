import express from 'express';
import siteController from '../controller/SiteController.js';

const router = express.Router();

router.get('/kridcon/:id', siteController.searchcon);
router.get('/krid/:id', siteController.search);
router.get('/', siteController.index);
// router.get('/:slug', siteController.search);
export default router;
