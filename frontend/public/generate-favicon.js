const { favicons } = require('favicons');
const fs = require('fs');
const path = require('path');

const source = 'GNH-isotype.png';

const configuration = {
	path: '/',
	appName: 'GameNight Hub',
	appShortName: 'GameNight',
	appDescription: 'Board game collection and event manager',
	background: '#f8fafc',
	theme_color: '#4ade80',
	display: 'standalone',
	start_url: '/',
	icons: {
		android: true,
		appleIcon: true,
		favicons: true,
		windows: true,
	},
};

(async () => {
	const response = await favicons(source, configuration);

	response.images.forEach((image) => {
		fs.writeFileSync(image.name, image.contents);
		console.log(`✓ Created ${image.name}`);
	});

	response.files.forEach((file) => {
		fs.writeFileSync(file.name, file.contents);
		console.log(`✓ Created ${file.name}`);
	});
})();
