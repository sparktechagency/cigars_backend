/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response, application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
const app: Application = express();
import sendContactUsEmail from './app/helper/sendContactUsEmail';
import axios from 'axios';
// parser
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ['http://localhost:3007', 'http://localhost:3008'],
        credentials: true,
    })
);
app.use('/uploads', express.static('uploads'));
// application routers ----------------
app.use('/', router);
app.post('/contact-us', sendContactUsEmail);

app.get('/', async (req, res) => {
    res.send({ message: 'nice to meet you' });
});

const apiKey = process.env.GOOGLE_API_KEY; // Replace with your API key

app.post('/search-place', async (req, res) => {
    try {
        const { address } = req.body; // Get address from the request body

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }
        console.log('key', apiKey);

        console.log(encodeURIComponent(address));
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${apiKey}`;
        console.log('url', url);
        const response: any = await axios.get(url);
        console.log('response', response);

        if (response.data.status === 'OK') {
            const placeId = response.data.results[0].place_id; // Extract place_id
            return res.status(200).json({ placeId });
        } else {
            return res
                .status(400)
                .json({ error: 'Place not found or invalid request' });
        }
    } catch (error) {
        console.error('API request error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// global error handler
app.use(globalErrorHandler);
// not found
app.use(notFound);

export default app;
