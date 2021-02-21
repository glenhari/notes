const expres = require('express');
const router = expres.Router();
const notes = require('../models/notes-memory');

router.get('/', async (req,res,next) =>{
    let keylist = notes.keylist();
	let keyPromises = (await keylist).map(key => {
        return notes.read(key)
    });
    let notelist = await Promise.all(keyPromises);
    res.render('index', {title:'notes',notelist:notelist});
});

module.exports = router;