import util from 'util';
import express from 'express';
import * as notes from '../models/notes.mjs';


/* GET home page. */
const router = express.Router();

router.get('/', async (req,res,next) =>{
  let keylist = notes.keylist();
let keyPromises = (await keylist).map(key => {
      return notes.read(key)
  });
  let notelist = await Promise.all(keyPromises);
  res.render('index', {title:'notes',notelist:notelist});
});


export {router};