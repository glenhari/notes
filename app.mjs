import fs from 'fs-extra';
import url from 'url';
import express from 'express';
import hbs from 'hbs';
import path from 'path';
import util from 'util';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import DBG from 'debug';
const debug = DBG('notes:debug');
const error = DBG('notes:error');
import { router as index } from './routes/index.mjs';
import { router as notes } from './routes/notes.mjs';
import { router as erro } from './routes/error.mjs';

// Workaround for lack of __dirname in ES6 modules
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();

import rfs from 'rotating-file-stream';
var logStream;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname,'partials'));
app.use(favicon('favicon.ico'));

app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/assets/vendor/bootstrap', express.static(
  path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use('/assets/vendor/jquery', express.static(
  path.join(__dirname, 'node_modules', 'jquery')));
app.use('/assets/vendor/popper.js', express.static(
  path.join(__dirname, 'node_modules', 'popper.js', 'dist')));
app.use('/assets/vendor/feather-icons', express.static(
  path.join(__dirname, 'node_modules','feather-icons','dist')));


app.use('/', index);
//app.use('/users', usersRouter);
app.use('/notes', notes);
app.use('/error',erro);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (process.env.REQUEST_LOG_FILE) {
	(async () => {
		let logDirectory = path.dirname(process.env.REQUEST_LOG_FILE);
		await fs.ensureDir(logDirectory);
		logStream = rfs(process.env.REQUEST_LOG_FILE, {
			size: '10M', // rotacione a cada 10 MegaBytes escritos
			interval: '1d', // rotacione diariamente
			compress: 'gzip' // comprima os arquivos rotacionados
		});
})().catch(err => { console.error(err); });
}
export default app;