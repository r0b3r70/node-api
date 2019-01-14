const express       = require('express'),
      bodyParser    = require('body-parser'),
      csrf          = require('csurf'),
      cookieParser  = require('cookie-parser'),
      app           = express();


class Server {

    constructor() {
        this.initHeaders();
        //this.initMiddleware();
        this.initRoutes();
        this.start();
    }
 
    initMiddleware() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(csrf({ cookie: true }));

        // app.use((req, res, next) => {
        //     let csrfToken = req.csrfToken();
        //     res.locals._csrf = csrfToken;
        //     res.cookie('XSRF-TOKEN', csrfToken);
        //     next();
        // }); 
    }

    initHeaders() {
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, HC-API-Auth");
            res.setHeader('Access-Control-Expose-Headers', 'app-count');
            res.removeHeader('X-Powered-By');
            next();
        });
    }

    getFile(name) {
        return require('./data/'+name+'.json');        
    }

    initRoutes() {
        app.get('/api', (req, res) => { 
            res.json({result: 'Welcome to my API'}); 
        });

        app.get('/api/:endpoint', (req, res) => {
            this.doLog(req);
            res.json(this.getPagedData(this.getFile(req.params.endpoint), req.query)); 
        });

        app.post('/api/:endpoint', (req, res) => {
            this.doLog(req);
            res.json(this.getFile(req.params.endpoint)); 
        });
        
        app.put('/api/:endpoint', (req, res) => {
            this.doLog(req);
            res.json(this.getFile(req.params.endpoint)); 
        });        
    } 

    getPagedData(data, query) {
        
        if (Array.isArray(data.data)) {
            var output    = {};
            var limit     = parseInt(query.limit) || 10;
            var offset    = parseInt(query.offset) || 0;
            output.count  = parseInt(data.data.length);
            var end = Math.min( (offset+limit), output.count);
            output.data = data.data.slice(offset, end);    
            return output;
        } else {
            return data;
        }
        
    }

    doLog(req) {
        console.log('Requested /' + req.params.endpoint + ' ' +JSON.stringify(req.query) +' ' + new Date().getTime() );
    }

    start() {
        app.listen(3000, () => console.log('Server running on port 3000'));   
    }
}

 
var server = new Server();