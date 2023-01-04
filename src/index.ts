import express from 'express';
import userRouter from './routes/users';
import bodyParser from 'body-parser';
import cors from "cors"; 

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // middleware que transforma la req.body a un json
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (_req, res) => {
  res.send('Homepage');
});

app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});
