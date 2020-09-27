const express = require('express')
const Task = require('../models/tasks')
const auth = require('../middleware/auth')
const router = new express.Router()

//endpoint for inserting user tasks in database
router.post('/tasks', auth, async (req, res) => {
    //const tasks = new Task(req.body)
    const tasks = new Task({
        ...req.body, 
        owner: req.user._id
    })

    try {
        const task = await tasks.save()
        return res.status(201).send(tasks)
    } catch (e) {
        return res.status(500).send(e)
    }
})

//endpoint for fetching all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options : {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.limit) * parseInt(req.query.page), 
                sort
            }
        }).execPopulate()
        return res.status(200).send(req.user.tasks)
    } catch (e) {
        return res.status(500).send(e)
    }
})

//endpoint for fetching all tasks
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }
        return res.status(200).send(task)
    } catch (e) {
        return res.status(500).send(e)
    }
})

//endpoint for updating task by id
router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Operation'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)

    } catch (e) {
        return res.status(500).send(e)
    }
})

//endpoint for updating task
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router