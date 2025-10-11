import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface clientApp {
  client_secret: string
  client_id: string
  app_name: string
  description: string
  redirect_callback: string
  scopes: string
  is_active: boolean
  app_type: string
  client_icon_url: string
  created_by: string
  grants?: Grant[]
}

export interface Grant {
  id: string
  description: string
  grants_name: string
  icon_text: string
  grant_code: string
  created_date: string
}

export interface GrantsType {
  id: string
  description: string
  grants_name: string
  icon_text: string
  grant_code: string
  created_date: string
}


//USUARIOS
export interface UserData {
  user_id: string
  username: string
  name: string
  last_name: string
  second_last_name: string
  email: string
  phone: string
  profile_picture: string
  status: string
  last_login: string
  biografia: string
  preferences: Preferences
  userBusiness: UserBusiness
  location: Location,
  sessions: number
}

export interface Preferences {
  id: string
  theme: string
  notifications: boolean
  timezone: string
  lang: string
}

export interface UserBusiness {
  id: string
  job_title: string
  department: string
  hire_date: string
  branch_id: string
}

export interface Location {
  location_id: string
  street_name: string
  street_number: string
  neighborhood: string
  city: string
  state: string
  postal_code: string
  country: string
}


/*****************ROLES**************************/
export interface Rol {
  id: string
  role_name: string
  role_code: string
  description: string
  module: string
  created_date: string
  created_by: string
  is_system: boolean
}
/*****************USER DETAILS********* */


export interface UserDetails {
  username: string
  totp: Totop | null
  sesions: Sesion[]
  preferences: Preferences
}

interface Sesion {
  agent: string
  ip_address: string
  created_date: string
  token_id: string,
  current: boolean
}
interface Totop {
  id: string
  failed_attempts: number
  expires_date: string
  last_attempt_date: string
  verified_status: string
}

export interface MfaTotp {
  id: string
  otpauth_url: string
  code: string
}
/****client*/
export interface Clients {
  client_secret: string
  client_id: string
  app_name: string
  description: string
  redirect_callback: string
  scopes: string
  is_active: boolean
  app_type: string
  client_icon_url: string
  created_by: string
  last_update_date: string,
  grants: Grant[],
  created_date: string
}

export interface Grant {
  id: string
  description: string
  grants_name: string
  icon_text: string
  grant_code: string
  created_date: string
}

/***TOKEN */
export interface TokenData {
  userId: string
  clientId: string
  username: string
  rols: Rol[]
  log_status: string
  iat: number
  exp: number
  email: string
  profile_picture: string
}

export interface Rol {
  role_code: string
  module: string
  policy_permission: string[]
}


export interface ListRols {
  id: string
  role_name: string
  role_code: string
  description: string
  created_by: string
  created_date: string
  is_system: boolean
  module: string
}

export interface RolDetails {
  users: UserRol[]
  role_name: string
  role_code: string
  description: string
  created_by: string
  created_date: string
  is_system: boolean
  module: string
  permissions: Permission[]
}

export interface UserRol {
  name: string
  user_id: string
  email: string
  last_name: string
  second_last_name: string
  profile_picture: any
  department: any
  job_title: string
  grant_date: string
}

export interface Permission {
  perm_code: string
  perm_name: string
  description: string
  action: string
  IS_SYSTEM: boolean
}
