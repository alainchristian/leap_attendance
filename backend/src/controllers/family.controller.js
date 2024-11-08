// src/controllers/family.controller.js
const { FamilyProfile, StudentProfile } = require('../models');

class FamilyController {
    async index(req, res) {
        try {
            const families = await FamilyProfile.findAll({
                include: [{
                    model: StudentProfile,
                    as: 'students',
                    where: { is_active: true },
                    required: false
                }],
                order: [['family_name', 'ASC']]
            });

            res.json({
                success: true,
                data: families
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
            const family = await FamilyProfile.findByPk(req.params.id, {
                include: [{
                    model: StudentProfile,
                    as: 'students',
                    where: { is_active: true },
                    required: false
                }]
            });

            if (!family) {
                return res.status(404).json({
                    success: false,
                    message: 'Family not found'
                });
            }

            res.json({
                success: true,
                data: family
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
            const family = await FamilyProfile.create(req.body);

            res.status(201).json({
                success: true,
                data: family
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
            const [updated] = await FamilyProfile.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Family not found'
                });
            }

            const family = await FamilyProfile.findByPk(req.params.id, {
                include: ['students']
            });

            res.json({
                success: true,
                data: family
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
            const deleted = await FamilyProfile.destroy({
                where: { id: req.params.id }
            });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Family not found'
                });
            }

            res.json({
                success: true,
                message: 'Family deleted successfully'
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

module.exports = new FamilyController();