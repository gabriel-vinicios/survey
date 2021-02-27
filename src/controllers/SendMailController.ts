import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import { UsersRepository } from '../repositories/UsersRepository'
import SendMailService from '../services/SendMailService'
import path from 'path'
import AppError from '../errors/AppError'

class SendMailController {

  async execute(request: Request, response: Response) {
    const {email, survey_id} = request.body

    const usersRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const userExists = await usersRepository.findOne({where:{email}})
    const surveyExists = await surveysRepository.findOne({where:{id: survey_id}})
    
    if(!userExists) 
    throw new AppError( 'User does not exists')

    if(!surveyExists) 
    throw new AppError('Survey does not exists')

    const npsPath = path.resolve(__dirname, '..', 'views', 'survey.template.hbs')

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: { user_id: userExists.id ,  value: null },
      relations: ['user', 'survey'],
    });


    const variables = {
      name: userExists.name, 
      title: surveyExists.title, 
      description: surveyExists.description,
      id: "",
      link: process.env.URL_MAIL
    }

    if(surveyUserExists){
      variables.id = surveyUserExists.id

      await SendMailService.execute(email, surveyExists.title, variables, npsPath)

      return response.json(surveyUserExists)
    }


    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id
    })

    await surveysUsersRepository.save(surveyUser)

    variables.id = surveyUser.id;

    await SendMailService.execute(email, surveyExists.title, variables, npsPath)

    return response.status(201).json(surveyUser)
  }
}

export { SendMailController }