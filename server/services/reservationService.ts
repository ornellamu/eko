import { localStorage } from '../db';
import { NotFoundError, BadRequestError } from '../utils/errors';

export interface CreateReservationDTO {
  userId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm
  partySize: number;
  seatingArea?: 'main_dining' | 'sunset_terrace' | 'vip_suite' | 'any';
  specialRequests?: string;
  occasion?: string;
}

export class ReservationService {
  private static generateReservationCode(): string {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `RES-${year}-${code}`;
  }

  public static async createReservation(dto: CreateReservationDTO) {
    if (dto.partySize < 1 || dto.partySize > 20) {
      throw new BadRequestError('Party size must be between 1 and 20 guests for direct booking. For larger events, please contact our concierge.');
    }

    // Check opening hours (10:00 to 23:00)
    const [hours] = dto.reservationTime.split(':').map(Number);
    if (hours < 10 || hours >= 23) {
      throw new BadRequestError('Reservations are available during opening hours (10:00 to 23:00).');
    }

    const code = this.generateReservationCode();
    const now = new Date().toISOString();

    const reservation = localStorage.insert('reservations', {
      reservation_code: code,
      user_id: dto.userId || null,
      customer_name: dto.customerName,
      customer_email: dto.customerEmail,
      customer_phone: dto.customerPhone,
      reservation_date: dto.reservationDate,
      reservation_time: dto.reservationTime,
      party_size: dto.partySize,
      seating_area: dto.seatingArea || 'main_dining',
      special_requests: dto.specialRequests || null,
      occasion: dto.occasion || null,
      table_number: (dto as any).tableNumber || null,
      admin_notes: (dto as any).adminNotes || null,
      status: (dto as any).status || 'pending', // Pending Maître d' verification
      created_at: now,
      updated_at: now
    });

    localStorage.insert('activity_logs', {
      actor_type: dto.userId ? 'user' : 'guest',
      actor_id: dto.userId || null,
      action: 'RESERVATION_CREATED',
      details: JSON.stringify({
        code,
        date: dto.reservationDate,
        time: dto.reservationTime,
        guests: dto.partySize,
        seatingArea: dto.seatingArea
      }),
      ip_address: '127.0.0.1',
      created_at: now
    });

    return reservation;
  }

  public static async getReservationByCode(code: string) {
    const reservation = localStorage.findOne('reservations', (r: any) => r.reservation_code.toUpperCase() === code.toUpperCase());
    if (!reservation) {
      throw new NotFoundError(`Reservation with code "${code}" was not found`);
    }
    return reservation;
  }

  public static async getUserReservations(userId: number) {
    const reservations = localStorage.find('reservations', (r: any) => r.user_id === userId);
    reservations.sort((a, b) => new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime());
    return reservations;
  }

  public static async getAllReservations(statusFilter?: string) {
    let reservations = localStorage.getTable('reservations');
    if (statusFilter && statusFilter !== 'all') {
      reservations = reservations.filter((r: any) => r.status === statusFilter);
    }
    reservations.sort((a, b) => new Date(b.reservation_date + 'T' + b.reservation_time).getTime() - new Date(a.reservation_date + 'T' + a.reservation_time).getTime());
    return reservations;
  }

  public static async updateReservationStatus(
    id: number,
    status: 'pending' | 'confirmed' | 'seated' | 'cancelled' | 'completed' | 'rejected' | string,
    adminNotes?: string,
    tableNumber?: string
  ) {
    const reservation = localStorage.findById('reservations', id);
    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    const updates: any = {
      status,
      admin_notes: adminNotes !== undefined ? adminNotes : reservation.admin_notes
    };
    if (tableNumber !== undefined) {
      updates.table_number = tableNumber;
    }

    const updated = localStorage.update('reservations', id, updates);

    localStorage.insert('activity_logs', {
      actor_type: 'admin',
      actor_id: 1,
      action: 'RESERVATION_STATUS_UPDATED',
      details: JSON.stringify({ id, code: reservation.reservation_code, newStatus: status, tableNumber }),
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    return updated;
  }
}
