import {Request, Response} from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import AppError from '../errors/AppError'

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params
    const { u } = request.query

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
    
    const surverUserExists = await surveysUsersRepository.findOne({
      id: String(u)
    })

    if(!surverUserExists){
      throw new AppError('Survey User does not exists')
    }

    surverUserExists.value = Number(value);

    await surveysUsersRepository.save(surverUserExists);

    return response.json(surverUserExists);

  }
}

export { AnswerController }
