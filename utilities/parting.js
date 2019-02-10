const path = require('path');

module.exports = function parting (filePath) {
	var fileName = path.basename(filePath, path.extname(filePath));
	var parts = fileName.split('_');

	return {
		fileName: fileName,
		name: parts[0],
		browser: parts[2],
		browserVersion: parts[3],
		resolution: parts[4]
	};
};