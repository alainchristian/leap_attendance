// src/controllers/attendance.controller.js
const { 
    EpAttendance, 
    EpRegistration, 
    StudentProfile, 
    EpOffering,
    EnrichmentProgram,
    User
} = require('../models');
const { Op } = require('sequelize');

class AttendanceController {
    async index(req, res) {
        try {
            const { start_date, end_date, offering_id } = req.query;
            
            const where = {};
            if (start_date && end_date) {
                where.attendance_date = {
                    [Op.between]: [start_date, end_date]
                };
            }

            const attendances = await EpAttendance.findAll({
                include: [
                    {
                        model: EpRegistration,
                        as: 'registration',
                        where: offering_id ? { offering_id } : {},
                        include: [
                            {
                                model: StudentProfile,
                                as: 'student'
                            },
                            {
                                model: EpOffering,
                                as: 'offering',
                                include: [
                                    {
                                        model: EnrichmentProgram,
                                        as: 'program'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'markedBy',
                        attributes: ['id', 'first_name', 'last_name']
                    }
                ],
                where,
                order: [['attendance_date', 'DESC']]
            });

            res.json({
                success: true,
                data: attendances
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
            const { registration_id, attendance_date } = req.body;

            // Check if attendance already exists for this date
            const existingAttendance = await EpAttendance.findOne({
                where: {
                    registration_id,
                    attendance_date
                }
            });

            if (existingAttendance) {
                return res.status(400).json({
                    success: false,
                    message: 'Attendance already marked for this date'
                });
            }

            // Add the marking user's ID
            req.body.marked_by_id = req.user.id;

            const attendance = await EpAttendance.create(req.body);

            const createdAttendance = await EpAttendance.findByPk(attendance.id, {
                include: [
                    {
                        model: EpRegistration,
                        as: 'registration',
                        include: [
                            {
                                model: StudentProfile,
                                as: 'student'
                            },
                            {
                                model: EpOffering,
                                as: 'offering',
                                include: [
                                    {
                                        model: EnrichmentProgram,
                                        as: 'program'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'markedBy',
                        attributes: ['id', 'first_name', 'last_name']
                    }
                ]
            });

            res.status(201).json({
                success: true,
                data: createdAttendance
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
            // Add the marking user's ID
            req.body.marked_by_id = req.user.id;

            const [updated] = await EpAttendance.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Attendance record not found'
                });
            }

            const attendance = await EpAttendance.findByPk(req.params.id, {
                include: [
                    {
                        model: EpRegistration,
                        as: 'registration',
                        include: [
                            {
                                model: StudentProfile,
                                as: 'student'
                            },
                            {
                                model: EpOffering,
                                as: 'offering',
                                include: [
                                    {
                                        model: EnrichmentProgram,
                                        as: 'program'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'markedBy',
                        attributes: ['id', 'first_name', 'last_name']
                    }
                ]
            });

            res.json({
                success: true,
                data: attendance
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getStudentAttendance(req, res) {
        try {
            const { student_id, start_date, end_date } = req.query;

            const where = {
                attendance_date: {}
            };

            if (start_date) where.attendance_date[Op.gte] = start_date;
            if (end_date) where.attendance_date[Op.lte] = end_date;

            const attendance = await EpAttendance.findAll({
                include: [
                    {
                        model: EpRegistration,
                        as: 'registration',
                        where: {
                            student_id
                        },
                        include: [
                            {
                                model: EpOffering,
                                as: 'offering',
                                include: [
                                    {
                                        model: EnrichmentProgram,
                                        as: 'program'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where,
                order: [['attendance_date', 'DESC']]
            });

            res.json({
                success: true,
                data: attendance
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async bulkStore(req, res) {
        try {
            const { offering_id, attendance_date, attendances } = req.body;

            // Get all registrations for this offering
            const registrations = await EpRegistration.findAll({
                where: {
                    offering_id,
                    registration_status: 'Active'
                }
            });

            // Create attendance records
            const attendanceRecords = registrations.map(registration => ({
                registration_id: registration.id,
                attendance_date,
                attendance_status: attendances[registration.student_id] || 'Absent',
                marked_by_id: req.user.id
            }));

            await EpAttendance.bulkCreate(attendanceRecords);

            res.status(201).json({
                success: true,
                message: 'Attendance records created successfully'
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

module.exports = new AttendanceController();