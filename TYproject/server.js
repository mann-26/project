const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/sendEmail', (req, res) => {
    const { userEmail } = req.body;

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'snaplooks204@gmail.com',
            pass: 'olil bxpu dfhd hall',
        },
    });

    // Email options
    const mailOptions = {
        from: 'snaplooks204@gmail.com',
        to: userEmail,
        subject: 'Booking Request',
        text: 'Thank you for using snaplooks. We recived you booking request you will be informed shortly.',
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
            return;
        }
        console.log('Email sent:', info.response);
        res.send('Email sent successfully');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
