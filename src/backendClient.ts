import { Configuration, DefaultApi } from "@dimfred/magic-circle-backend";

export { AxiosError } from "axios";
export * from "@dimfred/magic-circle-backend";

export interface BackendError {
  detail: string;
}

class BackendClient {
  private static instance: DefaultApi;
  public static getInstance(): DefaultApi {
    if (!BackendClient.instance) {
      const config = new Configuration({
        basePath: import.meta.env.VITE_BACKEND_URL,
      });
      BackendClient.instance = new DefaultApi(config);
    }
    return BackendClient.instance;
  }
}
export const backend = BackendClient.getInstance();
