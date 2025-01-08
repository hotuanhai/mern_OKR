import express from 'express';
import siteController from '../controller/PicController.js';

const router = express.Router();

router.get('/', siteController.index);
router.get('/listtask/:id', siteController.listOb);
// router.get('/', siteController.index);
// router.get('/:slug', siteController.search);
export default router;
