import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import * as Yup from 'yup'
import AppError from '../errors/AppError'

class UserController {
  async create(request: Request, response: Response){
    const {name, email} = request.body

    const scheme = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email().required('E-mail is required')
    })

    try {
      await scheme.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({errors: err})
    }

    const usersRepository = getCustomRepository(UsersRepository)

    const userExists = await usersRepository.findOne({ email })

    if(userExists){
      throw new AppError('User already exists')
    }

    const user = usersRepository.create({
      name,
      email
    })

    await usersRepository.save(user)

    return response.status(201).json(user)
  }
}

export { UserController }