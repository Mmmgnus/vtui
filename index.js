
const url = require('url');
// const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const find = require('find');
const handlebars = require('handlebars');
const chalk = require('chalk');

const TestNodes = require('./utilities/test-nodes/test-nodes');

const Handlebars = require('handlebars');

const DIR_TESTS =  __dirname + '/screenshots';

const PORT = 3002;

let counter = 0;

let nodes;


/*
Name format:
[test name]_[browser]_[browser version]_[resolution].png
*/

/*
nodes = {
	'[test name]: {
		title: [test name],
		resolutions: {
			[resolution]: {
				[browser]: {
					reference: '/',
					diff: '/',
					screen: '/'
				}
			}
		}
	}
}
*/

function initFileStructure () {
	nodes = new TestNodes();
	find.file(/\.png$/, DIR_TESTS + '/reference', function(files) {
		files.forEach(function (file) {
		  nodes.create(file, 'reference');
		});
	});

	find.file(/\.png$/, DIR_TESTS + '/diff', function(files) {
		files.forEach(function (file) {
			nodes.create(file, 'diff');
		});
	});

	find.file(/\.png$/, DIR_TESTS + '/screen', function(files) {
		files.forEach(function (file) {
			nodes.create(file, 'screen');
		});
	});
}

function readFile (file) {
	try {
		return fs.readFileSync(file).toString('utf-8');
	}
	catch (e) {
		return null;
	}
}

function renderPage(templateFile, data) {
	var file = readFile(templateFile);
	var template = Handlebars.compile(file);

	return new Handlebars.SafeString(template(data || {}));
}

const app = express();

// Assets used by the styleguide.
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', function (request, response) {
	const html = renderPage(__dirname + '/templates/index.hbs', nodes.toObject());
	response.send(html.string);
});

app.post('/okay/:name', function (request, response) {
	const name = request.params.name;

	const oldPath = path.join(__dirname, 'screenshots', 'screen', name + '.png');
	const newPath = path.join(__dirname, 'screenshots', 'reference', name + '.png');
	fs.renameSync(oldPath, newPath);
	fs.unlink(path.join(__dirname, 'screenshots', 'diff', name + '.png'));

	initFileStructure();
	response.send('DONE!');
});

app.get('/favicon.ico', function(request, response) {

});

initFileStructure();

console.log(chalk.bold('\nStarting styleguide…'));
app.listen(PORT, () => console.log(chalk.green('Styleguide is running at http://localhost:' + PORT), '\n'));