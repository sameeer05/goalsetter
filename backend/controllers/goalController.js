const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalsModel')
const User = require('../models/userModel')

// @desc Get Goals
// #route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })

    res.status(200).json(goals)
})

// @desc Set Goal
// #route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error("Please add a text field")
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(goal)
})

// @desc Update Goals
// #route PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error("Goal not found")
    }

    // Check for User
    if(!req.user) {
        res.status(401)
        throw new Error('User not Found')
    }

    // To check if the logged in user matches the Goal User
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not Authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
    
    updatedGoal.save()

    res.status(200).json(updatedGoal)
})

// @desc Delete Goal
// #route DELETE /api/goals/:id
// @access Private
const deleteGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error("Goal not found")
    }

    // Check for User
    if(!req.user) {
        res.status(401)
        throw new Error('User not Found')
    }

    // To check if the logged in user matches the Goal User
    if(goal.user.toString() !== req.user.id) {
        res.status(401).json({error: 'User not authorized'})
        throw new Error('User not Authorized')
    }

    await Goal.findByIdAndDelete(req.params.id)

    res.status(200).json({id: req.params.id})
}

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}