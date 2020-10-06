const request = require('supertest')
const app = require('../src/app')
const {userOneId, userOne, userTwo, userTwoId, taskOne, setUpDatabase} = require('./fixtures/db')
const Task  = require('../src/models/tasks')

beforeEach(setUpDatabase)

test('Should create task for the user', async () => {
    const response = await request(app)
          .post('/tasks')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send({
              description: 'From my test'
          })
          .expect(201)
          
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)       
})

test('Fetch tasks for particular user', async () => {
    const response = await request(app)
       .get('/tasks')
       .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
       .send()
       .expect(200)

    expect(response.body.length).toEqual(2)      
})

test('Delete task security', async () => {
    await request(app)
       .delete(`/tasks/${taskOne._id}`)
       .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
       .send()
       .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()   
})