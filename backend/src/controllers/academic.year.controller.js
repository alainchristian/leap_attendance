// src/controllers/academic.year.controller.js
const { AcademicYear, EpRotation } = require('../models');

class AcademicYearController {
    async index(req, res) {
        try {
            const years = await AcademicYear.findAll({
                include: [{
                    model: EpRotation,
                    as: 'rotations'
                }],
                order: [['year_name', 'DESC']]
            });

            res.json({
                success: true,
                data: years
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
            const year = await AcademicYear.create(req.body);
            res.status(201).json({
                success: true,
                data: year
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async activate(req, res) {
        try {
            // Deactivate all other academic years
            await AcademicYear.update(
                { is_active: false },
                { where: { id: { [Op.ne]: req.params.id } } }
            );

            // Activate the selected academic year
            const [updated] = await AcademicYear.update(
                { is_active: true },
                { where: { id: req.params.id } }
            );

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Academic year not found'
                });
            }

            const year = await AcademicYear.findByPk(req.params.id);
            res.json({
                success: true,
                data: year
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

module.exports = new AcademicYearController();