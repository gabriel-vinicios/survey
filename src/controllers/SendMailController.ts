import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import { UsersRepository } from '../repositories/UsersRepository'
import SendMailService from '../services/SendMailService'
import path from 'path'

class SendMailController {

  async execute(request: Request, response: Response) {
    const {email, survey_id} = request.body

    const usersRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const userExists = await usersRepository.findOne({where:{email}})
    const surveyExists = await surveysRepository.findOne({where:{id: survey_id}})
    
    if(!userExists) 
    return response.status(400).json({error: 'User does not exists'})

    if(!surveyExists) 
    return response.status(400).json({error: 'Survey does not exists'})

    const npsPath = path.resolve(__dirname, '..', 'views', 'survey.template.hbs')

    const variables = {
      name: userExists.name, 
      title: surveyExists.title, 
      description: surveyExists.description,
      user_id: userExists.id,
      link: process.env.URL_MAIL
    }

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: [{ user_id: userExists.id }, { value: null }],
      relations: ['user', 'survey'],
    });


    if(surveyUserExists){
      await SendMailService.execute(email, surveyExists.title, variables, npsPath)

      return response.json(surveyUserExists)
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id
    })

    await surveysUsersRepository.save(surveyUser)


    await SendMailService.execute(email, surveyExists.title, variables, npsPath)

    return response.status(201).json(surveyUser)
  }
}

export { SendMailController }
