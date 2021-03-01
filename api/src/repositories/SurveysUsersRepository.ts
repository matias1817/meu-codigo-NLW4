import { Entity, EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/surveysuser";

@EntityRepository(SurveyUser)
class SurveyUserRepository extends Repository<SurveyUser>{
    static save(surveyUser: SurveyUser) {
        throw new Error("Method not implemented.");
    }
} 

export { SurveyUserRepository }