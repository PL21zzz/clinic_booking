import { Request, Response } from 'express';
import Invoice from '../models/Invoice'; // <--- Import Model

// 1. Lấy thông tin thanh toán (Preview)
export const getInvoicePreview = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;
  const id = parseInt(appointment_id);

  try {
    // Gọi Model lấy dữ liệu (Chạy song song 2 query cho nhanh)
    const [service, medicines] = await Promise.all([
      Invoice.getServiceFee(id),
      Invoice.getMedicineFee(id)
    ]);

    // Tính toán tổng tiền (Logic nghiệp vụ để ở Controller là đúng)
    const serviceFee = parseFloat(service?.price || 0);
    const medicineFee = medicines.reduce((acc: number, item: any) => acc + parseFloat(item.total), 0);
    const totalAmount = serviceFee + medicineFee;

    res.json({
      success: true,
      data: {
        service_fee: { name: service?.name, price: serviceFee },
        medicines: medicines,
        total_amount: totalAmount
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi tính toán viện phí' });
  }
};

// 2. Tạo hóa đơn (Thanh toán)
export const createInvoice = async (req: Request, res: Response) => {
  const { appointment_id, total_amount, payment_method } = req.body;

  try {
    // Gọi Model xử lý toàn bộ Transaction (Insert + Update)
    const newInvoice = await Invoice.create(appointment_id, total_amount, payment_method);

    res.status(201).json({ success: true, message: 'Thanh toán thành công!', data: newInvoice });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi tạo hóa đơn' });
  }
};
