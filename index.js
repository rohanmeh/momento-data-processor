import express from 'express';
import cors from 'cors';
import { Messenger } from './services/messenger.js';

const app = express();
app.use(express.json());
app.use(cors());
app.listen(8000, () => { console.log('listening on port 8000') });
await Messenger.configure();
