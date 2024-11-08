
// src/controllers/enrichment.program.controller.js
const { EnrichmentProgram, EpCenter } = require('../models');

class EnrichmentProgramController {
    async index(req, res) {
        try {
            const programs = await EnrichmentProgram.findAll({
                include: [{
                    model: EpCenter,
                    as: 'center'
                }]
            });

            res.json({
                success: true,
                data: programs
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
            const program = await EnrichmentProgram.findByPk(req.params.id, {
                include: [{
                    model: EpCenter,
                    as: 'center'
                }]
            });

            if (!program) {
                return res.status(404).json({
                    success: false,
                    message: 'Program not found'
                });
            }

            res.json({
                success: true,
                data: program
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
            const program = await EnrichmentProgram.create(req.body);
            res.status(201).json({
                success: true,
                data: program
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
            const [updated] = await EnrichmentProgram.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Program not found'
                });
            }

            const program = await EnrichmentProgram.findByPk(req.params.id);
            res.json({
                success: true,
                data: program
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
            const deleted = await EnrichmentProgram.destroy({
                where: { id: req.params.id }
            });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Program not found'
                });
            }

            res.json({
                success: true,
                message: 'Program deleted successfully'
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

module.exports = new EnrichmentProgramController();