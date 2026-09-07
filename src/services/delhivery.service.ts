import type { DelhiveryPayload, DelhiveryResponse } from "@/types/shipping";

export const delhiveryService = {
  async createShipment(payload: DelhiveryPayload): Promise<DelhiveryResponse> {
    const apiToken = process.env.DELHIVERY_API_TOKEN;

    if (!apiToken) {
      return { success: false };
    }

    try {
      const response = await fetch(process.env.DELHIVERY_API_URL!, {
        method: "POST",
        headers: {
          Authorization: `Token ${apiToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: `format=json&data=${JSON.stringify(payload)}`,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          data,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("[SHIPMENT:ERROR]", e);
      return {
        success: false,
      };
    }
  },
};
