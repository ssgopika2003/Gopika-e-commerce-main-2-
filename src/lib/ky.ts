import ky from "ky";

const kyInstance = ky.create({
  credentials: "include",
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    }),
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = (await response.json()) as any;
            if (data?.message) {
              throw new Error(data.message);
            }
          } catch (e) {
            // If it's already an error from the throw above, re-throw it
            if (e instanceof Error && e.message !== "Failed to parse JSON") {
              throw e;
            }
            // Otherwise ignore and let ky handle the status error
          }
        }
      },
    ],
  },
});

export default kyInstance;
