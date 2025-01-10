interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends SignInCredentials {}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

  static async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Sign in failed');
    }

    return response.json();
  }

  static async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Sign up failed');
    }

    return response.json();
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${this.BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }
} 