const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin_login.html'));
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
        text: 'Thank you for using snaplooks. We received your booking request. You will be informed shortly.',
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


app.post('/send-decline-notification', (req, res) => {
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
        subject: 'Booking Request Declined',
        text: 'Your booking request was declined',
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


// New endpoint for sending review form link
app.post('/send-review-link', (req, res) => {
    const { userEmail, userId } = req.body;

    // Your website URL
    const websiteUrl = 'http://localhost:3000';  // Update the port if necessary

    // Your review form link
    const reviewFormLink = `${websiteUrl}/YourBookings.html`;

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
        subject: 'Complete Your Booking - Leave a Review',
        text: `Dear user,\n\nThank you for using snaplooks! Please take a moment to leave a review for your recent booking.\n\n${reviewFormLink}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending review link:', error);
            res.status(500).json({ success: false, message: 'Failed to send review link.' });
        } else {
            console.log('Review link sent:', info.response);
            res.status(200).json({ success: true, message: 'Review link sent successfully.' });
        }
    });
});

// Endpoint to handle salon/freelancer approval or decline
app.post('/send-approval-email', (req, res) => {
    const { userType, userEmail, status } = req.body;

    // Define email subject and body based on approval status
    const subject = status === 'approved' ? 'Application Approved' : 'Application Declined';
    const text = status === 'approved'
        ? 'Congratulations! Your application has been approved.'
        : 'Unfortunately, your application has been declined.';

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
        subject: subject,
        text: text,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Error sending email' });
            return;
        }
        console.log('Email sent:', info.response);
        res.json({ success: true, message: 'Email sent successfully' });
    });
});


app.post('/send-booking-approved-email', (req, res) => {
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
        subject: 'Booking Approved',
        text: 'Your booking is approved ',
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

app.post('/send-booking-decline-email', (req, res) => {
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
        subject: 'Booking Declined',
        text: 'Your booking is declined ',
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

app.post('/send-cancellation-email', (req, res) => {
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
        subject: 'Booking Cancelled',
        text: 'Your booking is Cancelled ',
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

module.exports = app;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
