const url = require('url');
// const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const find = require('find');
const handlebars = require('handlebars');
const chalk = require('chalk');

const Handlebars = require('handlebars');

const DIR_TESTS =  __dirname + '/screenshots';

const PORT = 3002;

let counter = 0;

let nodes = [];

function initFileStructure () {
	nodes = [];
	find.file(/\.png$/, DIR_TESTS + '/reference', function(files) {
		files.forEach(function (file) {
		  createNode(file, 'reference');
		});
	});

	find.file(/\.png$/, DIR_TESTS + '/diff', function(files) {
		files.forEach(function (file) {
		  createNode(file, 'diff');
		});
	});

	find.file(/\.png$/, DIR_TESTS + '/screen', function(files) {
		files.forEach(function (file) {
		  createNode(file, 'screen');
		});
	});
}

function createNode (file, type) {
	let name = path.basename(file, path.extname(file));
	let node = (nodes[name]) ? nodes[name] : { id:'test-' + counter++, name: name, path: path.dirname(file), img: {}};

	if (type === 'diff') {
		node.failed = true;
	}

	node.img[type] = file;
	nodes[name] = node;

	return node;
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

function getNode(id) {
	var _node;
	nodes.forEach(function (node) {
		console.log('lloo');
		if (node.id == id) {
			_node = node;
		}
	});

	return nodes[0];
}

function toObject (array) {
	var obj = {};

	for (let key in nodes) {
		obj[key] = nodes[key]
	}

	return obj;
}

const app = express();

// Assets used by the styleguide.
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', function (request, response) {
	const html = renderPage(__dirname + '/index.hbs', {nodes: toObject(nodes)});
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