import { SVGProps } from "react";

export interface ApiResponse<T> {
  code: number;
  statusCode: number;
  data: T;
  message: string;
  page: number;
  pageSize: number;
  totalCount: number;
  total?: number;
}

export interface User {
  user_id: string;
  username: string;
  name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  phone: string | null;
  profile_picture: string;
  status?: string | null;
  last_login?: string;
  biografia?: string | null;
  preferences?: Preferences;
  userBusiness: UserBusiness;
  location: Location;
  last_update_avatar: number | null
  mfa_enable?: boolean
  sessions?: number
}


export interface UserBusiness {
  id?: string | null;
  job_title?: string | null;
  department?: string | null;
  hire_date?: string | null;
  branch_id?: string | null;
}

export interface Location {
  location_id?: string | null;
  street_name?: string | null;
  street_number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export interface ClientApp {
  client_id: string;
  client_secret: string;
  app_name: string;
  description?: string | null;
  redirect_callback: string;
  scopes?: string | null;
  is_active?: boolean | null;
  app_type?: string | null;
  client_icon_url: string;
  created_by?: string | null;
  created_date: string
  last_update_date: string
  grants: Grant[];
}

export interface Grant {
  id: string;
  icon_text: string
  grants_name: string
  grant_code: string;
  description?: string | null;
}

export interface CreateClientRequest {
  app: string;
  grants: string[];
  data: {
    description: string;
    redirect_callback: string;
    scopes: string;
    app_type: string;
  };
}

export interface Role {
  id: string;
  role_name?: string | null;
  role_code?: string | null;
  description?: string | null;
  module?: string | null;
  created_date: string;
  created_by?: string | null;
  is_system?: boolean | null;
}

export interface RoleDetailsPs {
  id: string;
  role_name: string;
  role_code: string;
  description?: string | null;
  module?: string;
  created_date: string;
  created_by: string;
  is_system: boolean;
  users: UserRolPs[];
  permissions: PermissionsRole[]
}
export interface PermissionsRole {
  perm_code: string,
  perm_name: string,
  description: string,
  action: string,
  IS_SYSTEM: boolean
}
export interface UserRolPs {
  name: string,
  email: string,
  user_id: string,
  last_name: string,
  second_last_name: string,
  profile_picture: string,
  last_update_avatar: number | null,
  grant_date: string
  department?: string
}
export interface Preferences {
  id: string;
  theme: string;
  notifications: boolean | null;
  timezone: string | null;
  lang: string;
}
export interface UserDetails {
  username: string;
  totp: MFATotp | null;
  sesions: {
    current: boolean;
    created_date: string;
    token_id: string;
    agent: string | null;
    ip_address: string | null;
  }[];
  preferences: Preferences;
}
export interface MFATotp {
  id: string;
  failed_attempts: number | null;
  expires_date: Date | null;
  last_attempt_date: string;
  verified_status: string | null;
}

export interface Create2FA {
  id: string,
  otpauth_url: string,
  code: string
}

export interface Federated {
  app_name: string
  description: string
  redirect_callback: string
  client_icon_url: string
  name: string
  email: string
  profile_picture: string
  last_update_avatar: number | null
  last_update_date: number | null
}


export interface Permission {
  perm_code: string
  perm_name: string
  description: string
  action: string
  IS_SYSTEM: boolean
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};