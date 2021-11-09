const express = require('express'),
body_parser = require('body-parser'),
multer  = require('multer'),
requests = require('request'),
fs = require('fs'),
util = require('util'),
unlinkFile = util.promisify(fs.unlink),
upload = multer({ dest: __dirname+'/data/' });

const { uploadFile } = require('./s3');


// --- INSTANTIATE THE APP
app = express();
// --- STATIC MIDDLEWARE 
app.use(express.static(__dirname+'/public'));
app.use('/jspsych', express.static(__dirname + "/jspsych"));

app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb',extended:false}));

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

app.post('/video_data', upload.single('file'),async(req,res)=>{
	console.log(req.file);

	

	try{
    	//console.log(req);
    	console.log(req.file.filename);
	    const result = await uploadFile(req.file,req.file.path,data_dict['subject_id']+'-video.webm');
	    await unlinkFile(req.file.path)
	  	//console.log(result);

	  	// const description = req.body.description
		res.status(200).send({success:true});
		//await unlinkFile(req.file.path);
	} catch(err){
		console.log(err);
	}
});

var data_dict = {};

app.post('/save_data',upload.single('file'),async(request,response)=>{
	data_dict['subject_id'] = request.body.fname;
	console.log(request.file);
	try{

  //  		const data = JSON.parse(JSON.stringify(request.body.file));
		// csvWriter.writeRecords(data)
		// 	.then(()=> {
  // 				console.log('sending Data');
  // 			});
  // 		const path = __dirname +'/data/'+request.body.subject_id.toString()+'.csv';
  		console.log(request.file);
	  	const result = await uploadFile(request.file,request.file.path,data_dict['subject_id']+'-data.csv')
	  	await unlinkFile(request.file.path)
	  	console.log(result)	  	
	  	
	  	response.status(201).send({success:true});
	  	//await unlinkFile(path);
	  	
	} catch(err){
		console.log(err);
	}
});

app.post('/email',function(request,response){
	const{email,name,message} = request.body;
	const mcData = {
		members:[
			{
				email_address : email,
				status : "pending",
				
			}
		]
	}
	console.log(mcData);
	const mcDataPost = JSON.stringify(mcData);
	const options = {
		url: "",
		method:"POST",
		headers:{
			Authorization: ""
		},
		body:mcDataPost
	}
	if(email){
		//success
		requests(options,(err,responses,body) => {
			if(err){
				console.log(err);
				response.json({error:err})
			}else{
				response.status(200).send({message:"success"});
			}
		})
	}
	else{
		response.status(404).send({message:"Failed"});
	}
});

// --- START THE SERVER 
var server = app.listen(process.env.PORT||3000 , function(){
    console.log("Listening on port %d", server.address().port);
});

