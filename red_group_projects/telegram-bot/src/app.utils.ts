export const showList = todos => `Список дел: \n\n${
    todos.map(e => e.id + ' | ' + (e.isCompleted ? '✅' : '❌') + ' ' + e.name).join('\n')
}`