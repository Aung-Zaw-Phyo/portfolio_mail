const express = require('express')
const app = express()
const cors = require('cors')
var elasticemail = require('elasticemail');

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(express.json());
app.use(cors(corsOptions))



var client = elasticemail.createClient({
  apiKey: '0A42392A866499832E52B398B877C3D2C21A5CB3427067D72414AE4879352497361F04C46511D7244C893347190E0549'
});

app.get('/', (req, res, next) => {
    res.send('Server is running ....')
})

app.post('/api/portfolio/send-email', async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message;

        if(!name || !email || !message) {
            const error = new Error('All fields are required.')
            error.statusCode = 422
            throw error
        }

        var msg = {
            from: 'aungzawphyo1102@gmail.com',
            from_name: name,
            to: 'aungzawphyo1102@gmail.com',
            subject: email,
            body_text: message
        };

        client.mailer.send(msg, function(err, result) {
            if (err) {
                console.error('error: ', err.code);
                res.status(500).json({status: false, message: 'Server Error'})
            }else {
                console.log(result)
                res.status(200).json({status: true, message: 'Successfully Sent Message.'})
                // const text = 'Error: From email address: "'+ email +'" not allowed.'
                // const validateText = text === result
                // if(validateText) {
                //     console.error('error: ', err);
                //     res.status(422).json({status: false, message: 'Please enter your valid email.'})
                // }else {
                //     res.status(200).json({status: true, message: 'Successfully Sent Message.'})
                // }
            }
        });
    } catch (error) {
        const statusCode = error.status || 500
        const message = error.message || 'Something Wrong.'
        res.status(statusCode).json({status: false, message: message})
    }
})

app.listen(6060, () => console.log('server is running on port: 6060'))