

// src/controllers/rotation.controller.js
const { EpRotation, AcademicYear, EpOffering } = require('../models');

class RotationController {
    async index(req, res) {
        try {
            const rotations = await EpRotation.findAll({
                include: [
                    {
                        model: AcademicYear,
                        as: 'academicYear'
                    },
                    {
                        model: EpOffering,
                        as: 'offerings'
                    }
                ],
                order: [
                    ['academic_year_id', 'DESC'],
                    ['grade_level', 'ASC'],
                    ['rotation_number', 'ASC']
                ]
            });

            res.json({
                success: true,
                data: rotations
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
            const rotation = await EpRotation.create(req.body);
            res.status(201).json({
                success: true,
                data: rotation
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
            const [updated] = await EpRotation.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Rotation not found'
                });
            }

            const rotation = await EpRotation.findByPk(req.params.id);
            res.json({
                success: true,
                data: rotation
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
            const rotation = await EpRotation.findByPk(req.params.id);
            
            if (!rotation) {
                return res.status(404).json({
                    success: false,
                    message: 'Rotation not found'
                });
            }

            // Deactivate all rotations with same grade level
            await EpRotation.update(
                { is_active: false },
                {
                    where: {
                        grade_level: rotation.grade_level,
                        id: { [Op.ne]: req.params.id }
                    }
                }
            );

            // Activate the selected rotation
            rotation.is_active = true;
            await rotation.save();

            res.json({
                success: true,
                data: rotation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async current(req, res) {
        try {
            const currentRotations = await EpRotation.findAll({
                where: { is_active: true },
                include: [
                    {
                        model: AcademicYear,
                        as: 'academicYear',
                        where: { is_active: true }
                    },
                    {
                        model: EpOffering,
                        as: 'offerings'
                    }
                ]
            });

            res.json({
                success: true,
                data: currentRotations
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

module.exports = new RotationController();