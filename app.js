var express = require('express'),
    body_parser = require('body-parser'),


// --- INSTANTIATE THE APP
app = express();
// --- STATIC MIDDLEWARE 
app.use(express.static(__dirname+'/public'));
app.use('/jspsych', express.static(__dirname + "/jspsych"));

app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb',extended:false}));

console.log(__dirname);

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname+'/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// --- ROUTING
app.get('/', function(request, response) {
    response.render('index.html');
});

app.get('/experiment', function(request, response) {
    response.render('experiment.html');
});

app.get('/endpage',function(request,response){
	response.render('endpage.html');
});

app.post('/video_data', function(req,res){
	console.log(req.headers);

	res.status(200).send({success:true});
});

app.post('/save_data',function(req,res){
	//console.log(req.body);
	res.status(200).send({success:true});
});

// --- START THE SERVER 
var server = app.listen(process.env.PORT||3000 , function(){
    console.log("Listening on port %d", server.address().port);
});

