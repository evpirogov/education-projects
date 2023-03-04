import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class AppService {
  constructor(@InjectRepository(TaskEntity) private readonly taskRepo: Repository<TaskEntity>) {
  }

  async getAll() {
    return this.taskRepo.find()
  }

  async getById(id: number) {
    return this.taskRepo.findOneBy({id})
  }

  async createTask(name: string) {
    const task = await this.taskRepo.create({name})
    await this.taskRepo.save(task)
    return this.getAll()
  }

  async doneTask(id: number) {
    const task = await this.getById(id)
    if (!task) return null
    task.isCompleted = !task.isCompleted
    await this.taskRepo.save(task)
    return this.getAll()
  }

  async editTask(id: number, name: string) {
    const task = await this.getById(id)
    if (!task) return null

    task.isCompleted = !task.isCompleted
    task.name = name

    await this.taskRepo.save(task)
    return this.getAll()
  }

  async removeTask(id: number) {
    const task = await this.getById(id)
    if (!task) return null
    await this.taskRepo.delete({id})
    return this.getAll()
  }
}

