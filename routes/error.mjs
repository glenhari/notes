import express from 'express';

/* GET home page. */
const router = express.Router();

router.get('/error', function(req, res, next) {
    res.render('error', { message: 'Erro' });
  });
  
  export {router};