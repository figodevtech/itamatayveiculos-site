export interface AppSettings {
  id: string;
  ai_description_monthly_limit: number;
  ai_description_usage_count: number;
  ai_description_last_reset: string;
  banner_interval: number;
  banner_duration: number;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

/** Fields safe and necessary to serialize into the public website. */
export type PublicAppSettings = Pick<
  AppSettings,
  "banner_interval" | "banner_duration" | "primary_color" | "secondary_color"
>;
