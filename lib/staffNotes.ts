export type StaffNote = {
  id: string;
  full_name: string;
  position: string;
  email: string;
  password: string;
  phone: string;
  comment: string;
  sort_order: number;
};

export const emptyStaffNote: Omit<StaffNote, "id" | "sort_order"> = {
  full_name: "",
  position: "",
  email: "",
  password: "",
  phone: "",
  comment: "",
};
