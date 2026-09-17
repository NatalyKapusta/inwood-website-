export type DealerNote = {
  id: string;
  dealer_name: string;
  company_name: string;
  address: string;
  phone: string;
  manager: string;
  contract_form: string;
  models_discussed: string;
  last_contact_date: string | null;
  email: string;
  comment: string;
  portal_login: string;
  portal_password: string;
  sort_order: number;
};

export const emptyDealerNote: Omit<DealerNote, "id" | "sort_order"> = {
  dealer_name: "",
  company_name: "",
  address: "",
  phone: "",
  manager: "",
  contract_form: "",
  models_discussed: "",
  last_contact_date: null,
  email: "",
  comment: "",
  portal_login: "",
  portal_password: "",
};
