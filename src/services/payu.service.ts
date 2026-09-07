import crypto from "crypto";

export interface PayUHashParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface PayUVerifyParams extends PayUHashParams {
  status: string;
  salt: string;
}

// sha512: key|txnid|amount|productinfo|firstname|email|udf1..udf5||||||salt
export const payuService = {
  generateHash(params: PayUHashParams, salt: string): string {
    const {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1 = "",
      udf2 = "",
      udf3 = "",
      udf4 = "",
      udf5 = "",
    } = params;

    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

    return crypto.createHash("sha512").update(hashString).digest("hex");
  },

  // sha512 reverse: salt|status||||||udf5..udf1|email|firstname|productinfo|amount|txnid|key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verifyResponseHash(params: any, salt: string): boolean {
    const {
      status,
      udf5 = "",
      udf4 = "",
      udf3 = "",
      udf2 = "",
      udf1 = "",
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      key,
      hash: receivedHash,
    } = params;

    // prepend additionalCharges if present
    const additionalCharges = params.additionalCharges || "";
    // eslint-disable-next-line no-useless-assignment
    let hashString = "";

    if (additionalCharges) {
      hashString = `${additionalCharges}|${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    } else {
      hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    }

    const calculatedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    return calculatedHash === receivedHash;
  },

  // build redirect payload
  buildPayload(
    params: PayUHashParams,
    salt: string,
    options: { surl: string; furl: string; payuUrl: string }
  ) {
    const hash = this.generateHash(params, salt);
    return {
      ...params,
      hash,
      surl: options.surl,
      furl: options.furl,
      payuUrl: options.payuUrl,
      service_provider: "payu_paisa",
    };
  },
};
