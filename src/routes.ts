import { Router } from 'express'
import { AnswerController } from './controllers/AnswerController'
import { NpsController } from './controllers/NpsController'
import { SendMailController } from './controllers/SendMailController'
import { SurveysController } from './controllers/SurveysController'
import { UserController } from './controllers/UserController'

const routes = Router()

const usersController = new UserController()
const surveysController = new SurveysController()
const sendMailController = new SendMailController()
const answerController = new AnswerController();
const npsController = new NpsController()

routes.post('/users', usersController.create)

routes.post('/surveys', surveysController.create)

routes.get('/surveys', surveysController.show)

routes.post('/sendMail', sendMailController.execute)

routes.get('/answers/:value', answerController.execute);

routes.get('/nps/:survey_id', npsController.execute);

export { routes }