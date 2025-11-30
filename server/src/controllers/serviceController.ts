// server/src/controllers/serviceController.ts
import { Request, Response } from 'express';
import Service from '../models/Service'; // <--- Import Model

// 1. Lấy danh sách tất cả dịch vụ
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.getAll();

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi Server' });
  }
};

// 2. Thêm dịch vụ mới
export const createService = async (req: Request, res: Response) => {
  const { name, price, duration_minutes } = req.body;

  try {
    const newService = await Service.create(name, price, duration_minutes);

    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi thêm dịch vụ' });
  }
};
