import { Context as ContextTelegrag } from 'telegraf'

export interface Context extends ContextTelegrag {
    session: {
        type?: 'create' | 'done' | 'edit' | 'remove'
    }
}