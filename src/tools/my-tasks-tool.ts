import { z } from 'zod'

const myTasksToolSchema = z.object({
  projectId: z.string().describe('The ID of the project to get tasks for'),
  status: z.enum(['open', 'closed']).describe('The status of the tasks to get'),
  limit: z.number().describe('The maximum number of tasks to return'),
  offset: z.number().describe('The offset to start the tasks from')
})

const myTasksToolHandler = async (params: z.infer<typeof myTasksToolSchema>): Promise<string> => {
  const { projectId, status, limit, offset } = params
  console.log(projectId, status, limit, offset)
  return 'Hello, world!'
}

export const myTasksTool = {
  name: 'my_tasks',
  description: 'Get all tasks for the current user',
  parameters: myTasksToolSchema,
  execute: myTasksToolHandler
}
