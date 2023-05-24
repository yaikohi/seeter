export type SubscribedWebhookEventType =
  | "user.updated"
  | "session.created"
  | "user.created";

export interface WebhookPayload {
  data: EventPayload;
  object: string;
  type: SubscribedWebhookEventType;
}
type EventPayload =
  | UserCreatedPayload
  | UserUpdatedPayload
  | SessionCreatedPayload;

export interface SessionCreatedPayload {
  abandon_at: number;
  actor: any;
  client_id: string;
  created_at: number;
  expire_at: number;
  id: string;
  last_active_at: number;
  object: string;
  status: string;
  updated_at: number;
  user_id: string;
}

export interface UserUpdatedPayload {
  birthday: string;
  created_at: number;
  email_addresses: EmailAddress[];
  external_accounts: any[];
  external_id: any;
  first_name: string;
  gender: string;
  id: string;
  last_name: any;
  last_sign_in_at: any;
  object: string;
  password_enabled: boolean;
  phone_numbers: any[];
  primary_email_address_id: string;
  primary_phone_number_id: any;
  primary_web3_wallet_id: any;
  private_metadata: object;
  profile_image_url: string;
  public_metadata: object;
  two_factor_enabled: boolean;
  unsafe_metadata: object;
  updated_at: number;
  username: string;
  web3_wallets: any[];
}

export type UserCreatedPayload = UserUpdatedPayload;

interface EmailAddress {
  email_address: string;
  id: string;
  linked_to: LinkedTo[];
  object: string;
  verification: Verification;
}

interface Verification {
  status: string;
  strategy: string;
}

interface LinkedTo {
  id: string;
  type: string;
}
