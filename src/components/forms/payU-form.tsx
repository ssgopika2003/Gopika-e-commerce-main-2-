import type { PayUInitiateRequest } from "@/types/checkout";

export function redirectToPayU(params: PayUInitiateRequest) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = process.env.NEXT_PUBLIC_PAYU_URL!;

  const formFields: Record<string, string> = {
    key: params.key,
    txnid: params.txnid,
    amount: params.amount,
    productinfo: params.productInfo,
    firstname: params.firstName,
    email: params.email,
    phone: params.phone,
    surl: params.surl,
    furl: params.furl,
    hash: params.hash,
    curl: params.curl ?? "",
    udf1: params.udf1 ?? "",
    udf2: params.udf2 ?? "",
    udf3: params.udf3 ?? "",
    udf4: params.udf4 ?? "",
    udf5: params.udf5 ?? "",
    address1: params.addressLine1 ?? "",
    address2: params.addressLine2 ?? "",
    city: params.city ?? "",
    state: params.state ?? "",
    country: params.country ?? "",
    zipcode: params.zipcode ?? "",
  };

  Object.entries(formFields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}
