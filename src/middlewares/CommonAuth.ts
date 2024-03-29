import { Request, NextFunction, Response } from 'express'
import {AuthPayload } from '../dto/Auth.dto'
import { ValidateSignature } from '../utility';

declare global {
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
} 

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {

    // console.log(req);
    // console.log(req);
    const signature = await ValidateSignature(req);
    if(signature){
        console.log("Authentication passed")
        return next()
    }else{
        return res.json({message: "User Not authorised"});
    }
}