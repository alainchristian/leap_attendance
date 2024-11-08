
// src/controllers/student.controller.js
const { StudentProfile, FamilyProfile } = require('../models');

class StudentController {
    async index(req, res) {
        try {
            const students = await StudentProfile.findAll({
                include: [{
                    model: FamilyProfile,
                    as: 'family'
                }]
            });

            res.json({
                success: true,
                data: students
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async show(req, res) {
        try {
            const student = await StudentProfile.findByPk(req.params.id, {
                include: [{
                    model: FamilyProfile,
                    as: 'family'
                }]
            });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.json({
                success: true,
                data: student
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async store(req, res) {
        try {
            const student = await StudentProfile.create(req.body);
            res.status(201).json({
                success: true,
                data: student
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const [updated] = await StudentProfile.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const student = await StudentProfile.findByPk(req.params.id);
            res.json({
                success: true,
                data: student
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async destroy(req, res) {
        try {
            const deleted = await StudentProfile.destroy({
                where: { id: req.params.id }
            });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.json({
                success: true,
                message: 'Student deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = new StudentController();