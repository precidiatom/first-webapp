const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 8080;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
})

hbs.registerHelper('capitalize', (text) => {
	return text.toUpperCase();
})

hbs.registerHelper('mainmenu', () => {
	return '..';
})

hbs.registerHelper('bunnypg', () => {
	return "/bunny";
})
hbs.registerHelper('infopg', () => {
	return "/info";
})

hbs.registerHelper('if', function(conditional, options) {
	if('about'){
		return "/info";
	} else if('bunny'){
		return "/bunny";
	} 
});

app.use((request, response, next) => {
	var time = new Date().toString();
	//console.log(`${time}: ${request.method} ${request.url}`);
	var log = `${time}: ${request.method} ${request.url}`;
	fs.appendFile('server.log', log + '\n', (error) => {
		if (error) {
			console.log('Unable to log message');
		}
	})
	next();
});

//////////[un]comment for maintainence purposes
app.use((request, response, next) => {
	response.render('maintainence.hbs');
});

app.get('/', (request, response) => {

	response.render('main.hbs', {
		title: 'Main',
		menu: 'menu',
		link1: '/info',
		link2: '/bunny'
	});
});

app.get('/info', (request, response) => {
	response.render('about.hbs', {
		title: 'About page', //can be static - call using double {{key}}
		year: new Date().getFullYear(), //can be a function
		welcome: 'good bye!',
		menu: 'Menu',
		link1: '..',
		link2: '/bunny'
	});
});

app.get('/bunny', (request, response) => {
	response.render('bunny.hbs', {
		title: 'Bunny eats pancake',
		menu: 'Menu',
		bunny: 'https://thumbs.gfycat.com/FelineWhisperedAlaskanmalamute-size_restricted.gif',
		link1: '..',
		link2: '/info'
	});
});

app.get('/maintainence', (request, response) => {
	response.render('maintainence.hbs', {
		title: 'Under construction'
	});

});

app.get('/404', (request, response) => {
	response.send({
		error: 'Page not found!'
	})
});

app.listen(port, () => {
	console.log('Server is up on the port ${port}');
});