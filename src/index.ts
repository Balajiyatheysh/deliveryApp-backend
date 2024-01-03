import express from 'express';
import App from './services/ExpressApp';
import databaseConnection  from './services/Database';
import {PORT} from '../src/config/index'

const StartServer = async () =>{
  const app = express();
  await databaseConnection();
  await App(app);
  app.listen(PORT, ()=>{
    console.log(`Listening to port number ${PORT}`)
  })
}
StartServer();