export interface PayuCallback {
  mihpayid?: string;
  mode?: string;

  status: "success" | "failure";
  unmappedstatus?: string;

  key: string;
  txnid: string;
  amount: string;

  productinfo: string;
  firstname: string;

  email: string;
  phone?: string;

  // User defined fields
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;

  // Payment details
  PG_TYPE?: string;
  bank_ref_num?: string;
  bankcode?: string;

  // Failure fields
  error?: string;
  error_Message?: string;

  // Extra fields
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  field7?: string;
  field8?: string;
  field9?: string;

  hash: string;
}
