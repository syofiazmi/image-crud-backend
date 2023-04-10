import express from 'express';
import FileUpload from 'express-fileupload';
import cors from 'cors';
import ImageRoute from './routes/ImageRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use(express.static('public'))
app.use(ImageRoute);

app.listen(5000, () => console.log('Server is running...'));