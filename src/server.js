const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const db = require('./models');

app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('Server', 'BB Web Server');
    next();
});

app.use(helmet());
app.use(
    helmet.permittedCrossDomainPolicies({
      permittedPolicies: "master-only",
    })
);
  
app.use(
    helmet.contentSecurityPolicy({
        directives: {
        "default-src": ["'self'"]
        }
    })
);

app.use(cors());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./routes')(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Messaging Service is running on port ${PORT}.`);
});

process.on('SIGINT', function() {
    db.mongoose.connection.close()
        .then(() => {
            process.exit(0);
        })
        .catch(() => {
            process.exit(1);
        });
});