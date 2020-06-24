const parting = require('../parting');

function TestNodes () {
	this.nodes = {};
}

const testNodesProto = TestNodes.prototype;

testNodesProto.create = function (path, type) {
	const parts = parting(path);
	const node = this.nodes[parts.name] || new Node(parts.name);

	node.add(parts, type);

	this.nodes[parts.name] = node;
};

testNodesProto.toObject = function () {
	let nodes = {};

	Object.getOwnPropertyNames(this.nodes).forEach((node) => {
		nodes[node] = this.nodes[node].toObject();
	});

	return {
		nodes: nodes
	};
};

function Node (title) {
	this.title = title;
	this.resolutions = {};
	this.failed = false;
	this.id = title.replace(' ', '-');
	this.browsers = {};
}

const NodeProto = Node.prototype;

NodeProto.add = function (parts, type) {
	const resolutions = this.resolutions[parts.resolution] || {};
	const browser = resolutions[parts.browser] || {};

	browser[type] = parts.fileName;
	this.browsers[parts.browser] = true;

	if (type === 'diff') {
		this.failed = true;
	}
	resolutions[parts.browser] = browser;
	this.resolutions[parts.resolution] = resolutions;
	this.fileName = parts.fileName;
};

NodeProto.toObject = function () {
	return {
		title: this.title,
		resolutions: this.resolutions,
		failed: this.failed,
		id: this.id,
		browsers: this.browsers,
		fileName: this.fileName
	};
};

module.exports = TestNodes;
