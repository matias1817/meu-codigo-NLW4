import { Entity, EntityRepository, Repository } from "typeorm";
import { Survey } from "../models/surveys";

@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey> {}

export { SurveysRepository };