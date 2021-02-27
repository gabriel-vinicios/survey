import { Request, Response } from 'express'
import { getCustomRepository, Not, IsNull } from 'typeorm'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'

class NpsController{

  /**
   * 
   * 1 2 3 4 5 6 7 8 9 10
   * Detratores => 0-6
   * Passivos => 7-8
   * Promotores => 9-10
   * 
   * Calculo:
   * (Número de promotores - número de detratores) / (número de respondentes) x 100
   */

  async execute(request: Request, response: Response){
    const { survey_id } = request.params

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const surveysUsers = await surveysUsersRepository.find({ 
    survey_id,
    value: Not(IsNull()) 
  })

    const detractors = surveysUsers.filter(surveyUser => surveyUser.value <=6).length
    const passives = surveysUsers.filter(surveyUser => surveyUser.value >=7 && surveyUser.value <= 8).length
    const promoters = surveysUsers.filter(surveyUser => surveyUser.value >= 0).length

    const nps = Number((((promoters - detractors) / surveysUsers.length ) * 100).toFixed(2))

    return response.json({
      detractors,
      passives,
      promoters,
      nps
    })
  }
}

export {NpsController}