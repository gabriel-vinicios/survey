import { Router } from 'express'
import { SendMailController } from './controllers/SendMailController'
import { SurveysController } from './controllers/SurveysController'
import { UserController } from './controllers/UserController'

const routes = Router()

const usersController = new UserController()
const surveysController = new SurveysController()
const sendMailController = new SendMailController()

routes.post('/users', usersController.create)

routes.post('/surveys', surveysController.create)

routes.get('/surveys', surveysController.show)

routes.post('/sendMail', sendMailController.execute)

export { routes }