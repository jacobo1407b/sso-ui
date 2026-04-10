import { BaseClient } from './base-client';
import { User, ClientApp, CreateClientRequest, Grant, Role, UserDetails, RoleDetailsPs, Create2FA, Federated } from "@/types";
import { Preferences } from '@/types';

class Util extends BaseClient {
  async download(file: string) {
    const url = this.buildUrl('/api/v1/utl/file/download', { file });
    return this.request<File>(url, { method: "GET" })
  }
  async setPreferences(id: string, data: Partial<Preferences>) {
    const url = `/api/v1/user/preferences/${id}`
    return this.request<null>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  async getFederated(client: string, user: string) {
    const url = this.buildUrl('/api/v1/sso/federated', { client, user });
    return this.request<Federated>(url, { method: "GET" })
  }
}

class UserClient extends BaseClient {
  async getAll(isLoad: boolean, params: { page?: number; pageSize?: number; user?: string } = {}) {
    const url = this.buildUrl('/api/v1/users', params);
    return this.request<User[]>(url, { method: 'GET' }, false, isLoad);
  }

  async getById(isLoad: boolean, id: string) {
    return this.request<User>(`/api/v1/user/${id}`, { method: 'GET' }, false, isLoad);
  }

  async create(data: Partial<User>, query?: { unid?: string; branch?: string }) {
    const url = this.buildUrl('/api/v1/user', query);
    return this.request<User>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<User>) {
    return this.request<void>(`/api/v1/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadFile(id: string, pub: string, image: File) {
    const url = this.buildUrl(`/api/v1/user/image/${id}`, { pub });
    const frm = new FormData();
    frm.append("image", image);
    return this.request<User>(url, {
      method: 'PUT',
      body: frm,
    }, true);
  }

  async getSession(id: string, session: string) {
    const url = this.buildUrl(`/api/v1/user/details/${id}`, { session });
    return this.request<UserDetails>(url, {
      method: "GET"
    });
  }
  async updatePassword(id: string, data: { pass: string; last_pass: string }) {
    return this.request<void>(`/api/v1/user/password/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  /** /oauth/revok   **/
  async deleteSession(id: string, main: string) {
    const url = this.buildUrl(`/api/v1/user/sesion/${id}`, { main });
    return this.request<UserDetails>(url, {
      method: "DELETE"
    });
  }

  async changePasswordLogout(session: string, data: { password: string, current_password: string, password_repit: string }) {

    return this.request<UserDetails>("/api/v1/user/passwchange/logout", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        session
      })
    });
  }
}

class AppClient extends BaseClient {
  async getAll(isLoad = false, params: { page?: number, pageSize?: number, q?: string } = {}) {
    const url = this.buildUrl('/api/v1/clients', params);
    return this.request<ClientApp[]>(url, { method: 'GET' }, false, isLoad);
  }

  async getById(id: string, isLoad = false) {
    return this.request<ClientApp>(`/api/v1/client/${id}`, { method: 'GET' }, false, isLoad);
  }

  async create(data: CreateClientRequest) {
    return this.request<ClientApp>('/api/v1/client', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: CreateClientRequest) {
    return this.request<void>(`/api/v1/client/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string) {
    return this.request<null>(`/api/v1/client/${id}`, { method: 'DELETE' });
  }

  async getGrants(isLoad = false) {
    return this.request<Grant[]>('/api/v1/client/grants/list', { method: 'GET' }, false, isLoad);
  }

  async setGrants(id: string, grants: any) {
    return this.request<void>(`/api/v1/client/grants/${id}`, {
      method: 'POST',
      body: JSON.stringify(grants),
    });
  }

  async uploadIcon(pub: string, id: string, icon: File) {
    const url = this.buildUrl(`/api/v1/client/file/${id}`, { pub });
    const frm = new FormData();
    frm.append("image", icon);
    return this.request<null>(url, {
      method: 'PUT',
      body: frm,
    }, true);
  }
}

class RoleClient extends BaseClient {
  async getAll(isLoad = false, params: { page?: number, size?: number, rol_code?: string }) {
    const url = this.buildUrl('/api/v1/rols', params);
    return this.request<Role[]>(url, { method: 'GET' }, false, isLoad);
  }

  async getById(id: string, isLoad = false) {
    return this.request<RoleDetailsPs>(`/api/v1/rol/${id}`, { method: 'GET' }, false, isLoad);
  }

  async create(data: Partial<Role>) {
    return this.request<Role>('/api/v1/rol', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async assignToUser(userId: string, roles: string[]) {
    return this.request<void>(`/api/v1/rols/${userId}`, {
      method: 'POST',
      body: JSON.stringify(roles),
    });
  }
}
class TotpClient extends BaseClient {
  async createTotp() {
    return this.request<Create2FA>(`/api/v1/2fa/totp/generate`, {
      method: 'GET',
    });
  }
  async verifyTotp(code: string, id: string) {
    return this.request<void>(`/api/v1/2fa/totp/verify`, {
      method: 'POST',
      body: JSON.stringify({ code, id }),
    });
  }
  async cancelTotp(id: string) {
    return this.request<void>(`/api/v1/2fa/totp/cancel/${id}`, {
      method: 'DELETE',
    });
  }
}
export const api = {
  users: new UserClient(),
  apps: new AppClient(),
  roles: new RoleClient(),
  util: new Util(),
  mfa: {
    totp: new TotpClient()
  }
};

