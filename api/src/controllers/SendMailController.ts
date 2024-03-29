import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUserRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepositories } from "../repositories/UsersRepositories";
import SendMailServices from "../services/SendMailServices";
import {resolve} from "path"
import { AppError } from "../errors/AppErrors";


class SendMailController {

    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body
        const usersRespository = getCustomRepository(UsersRepositories);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

        const user = await usersRespository.findOne({ email }); 

        if (!user) {
            return response.status(400).json({
                error: "User does not exists",
                
            })
        }
        const survey = await surveysRepository.findOne({
            id: survey_id,
        })

        if (!survey) {
            throw new AppError("survey does not exists")
            
        } 
        

        const npsPath = resolve(__dirname,"..","views","emails","npsMail.hbs")  

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value : null},
            relations: ["user", "survey"],
        })  
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "" ,
            link: process.env.URL_MAIL,
        } 
       console.log(variables)

        if (surveyUserAlreadyExists){ 
            variables.id = surveyUserAlreadyExists.id
            await SendMailServices.execute(email, survey.title, variables, npsPath) 
            return response.json(surveyUserAlreadyExists);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id, 
            survey_id,
        })
        

        await surveysUsersRepository.save(surveyUser); 

        variables.id = surveyUser.id 

       
         
        
        await SendMailServices.execute(email, survey.title , variables, npsPath)

        return response.json(surveyUser)
        
    }
} 

 
export { SendMailController}