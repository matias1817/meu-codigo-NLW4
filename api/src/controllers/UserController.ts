import { Request, Response } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { User } from "../models/user"
import { UsersRepositories } from "../repositories/UsersRepositories"; 
import * as yup from "yup"
import { AppError } from "../errors/AppErrors";

class UserController {
    async create(request: Request, response: Response) {
        const { name, email} = request.body;
        const schema = yup.object().shape({
            name: yup.string().required("nome é obrigatorio"),
            email: yup.string().email().required("email incorreto")
        })
        try{
            await schema.validate(request.body, {abortEarly: false})
        }catch(err){
            throw new AppError( err)
        }
        const usersRepository = getCustomRepository(UsersRepositories)
        const userAlreadyExists = await usersRepository.findOne({email})
        if (userAlreadyExists) {
           throw new AppError( "user already exists!")
        }
        const user = usersRepository.create({
            name,
            email, 
        }) 
        await usersRepository.save(user)
        return response.status(201).json(user)
    }
} 
export { UserController };