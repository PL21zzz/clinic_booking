// server/src/controllers/reportController.ts
import { Request, Response } from 'express';
import Report from '../models/Report'; // <--- Import Model

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Gọi Model lấy dữ liệu song song
        const [summary, revenueChart, statusChart, appointmentChart] = await Promise.all([
            Report.getGeneralStats(),
            Report.getRevenueChart(),
            Report.getStatusChart(),
            Report.getAppointmentChart()
        ]);

        res.json({
            success: true,
            data: {
                summary,
                revenueChart,
                statusChart,
                appointmentChart
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi lấy thống kê' });
    }
};
