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
  location: Location
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
