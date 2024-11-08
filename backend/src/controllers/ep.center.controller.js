// src/controllers/ep.center.controller.js
const { EpCenter, EnrichmentProgram } = require('../models');

class EpCenterController {
    async index(req, res) {
        try {
            const centers = await EpCenter.findAll({
                include: [{
                    model: EnrichmentProgram,
                    as: 'programs',
                    where: { is_active: true },
                    required: false
                }]
            });

            res.json({
                success: true,
                data: centers
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
            const center = await EpCenter.create(req.body);
            res.status(201).json({
                success: true,
                data: center
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
            const [updated] = await EpCenter.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Center not found'
                });
            }

            const center = await EpCenter.findByPk(req.params.id);
            res.json({
                success: true,
                data: center
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

module.exports = new EpCenterController();
