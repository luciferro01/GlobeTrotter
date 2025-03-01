export interface CommonResponse<t> {
  success: boolean;
  data?: t;
  message?: string;
}
