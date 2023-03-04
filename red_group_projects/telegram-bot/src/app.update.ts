import {Action, Command, Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { AppService } from './app.service';
import { Context } from './context.interface';
import {actionButtons} from "./app.buttons";
import { showList } from './app.utils';

const todos = [{
    id: 1,
    name: 'Buy goods',
    isCompleted: false,
  },{
    id: 2,
    name: 'Go to walk',
    isCompleted: false,
  },{
    id: 3,
    name: 'Travel',
    isCompleted: true,
  }]

@Update()
export class AppUpdate {
  constructor(
      @InjectBot() private readonly bot: Telegraf<Context>,
      private readonly appService: AppService
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi friend 👋!')
    await ctx.reply('Что ты хочешь сделать?', actionButtons())
  }

  @Hears('🤌 Создать задачу')
  async createTasks(ctx: Context) {
    ctx.deleteMessage()
    await ctx.reply('Напишите текст задачи:')
    ctx.session.type = 'create'
  }

  @Hears('🗒 Список задач')
  async listTasks(ctx: Context) {
    ctx.deleteMessage()
    const todos = await this.appService.getAll()
    await ctx.reply(showList(todos))
  }

  @Hears('✅ Завершить')
  async doneTask(ctx: Context) {
    ctx.deleteMessage()
    await ctx.reply('Напиши ID задачи: ')
    ctx.session.type = 'done'
  }

  @Hears('✏️ Редактирование')
  async editTask(ctx: Context) {
    ctx.deleteMessage()
    await ctx.replyWithHTML(
        'Напиши ID и новое название задачи:\n' +
        'В формате: <i>id \\ Текст задачи</i>'
    )
    ctx.session.type = 'edit'
  }

  @Hears('❌ Удаление')
  async removeTask(ctx: Context) {
    ctx.deleteMessage()
    await ctx.reply('Напиши ID задачи: ')
    ctx.session.type = 'remove'
  }

  @On('text')
  async getMessage(
    @Message('text') message: string,
    @Ctx() ctx: Context
  ) {
    if (!ctx.session.type) ctx.reply('Выбирете команду')
    ctx.deleteMessage()

    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message)
      await ctx.reply(showList(todos))
      ctx.session.type = undefined
    }

    if (ctx.session.type === 'done') {
      const todos = await this.appService.doneTask(Number(message))

      if (!todos) {
        ctx.reply('Задачи с таким ID не найдено')
        return
      }

      await ctx.reply(showList(todos))
      ctx.session.type = undefined
    }

    if (ctx.session.type === 'edit') {
      const [id, text] = message.split(' | ')

      const todos = await this.appService.editTask(Number(id), text)

      if (!todos) {
        ctx.reply('Задачи с таким ID не найдено')
        return
      }

      await ctx.reply(showList(todos))
      ctx.session.type = undefined
    }

    if (ctx.session.type === 'remove') {
      const todos = await this.appService.removeTask(Number(message))

      if (!todos) {
        ctx.reply('Задачи с таким ID не найдено')
        return
      }

      await ctx.reply(showList(todos))
      ctx.session.type = undefined
    }
  }
}
