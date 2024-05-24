import express from 'express';
import apikey from '../../auth/apikey';
import auth from './auth';
import user from './user';
import preference from './preference';
import client from './client';

const router = express.Router();

// APIs protected by api-key
router.use('/', apikey);

// public apis (public requests)
router.use('/auth', auth);

// private apis (private / role requests)
router.use('/user', user);
router.use('/client', client);
router.use('/preference', preference);


export default router;
