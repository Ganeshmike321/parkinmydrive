export interface ParkingSpot {
  id: number;
  status: number;
  slot_name: string;
  latitude: number;
  longitude: number;
  vehicle_fees: string;
  // Add any other required fields here
  [key: string]: any;
} 