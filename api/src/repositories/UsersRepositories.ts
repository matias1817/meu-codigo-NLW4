import { Entity, EntityRepository, Repository } from "typeorm";
import { User } from "../models/user";

@EntityRepository(User)
class UsersRepositories extends Repository<User> {}

export { UsersRepositories };