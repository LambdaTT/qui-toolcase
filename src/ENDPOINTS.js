export default {
  AUTH: {
    LOGGED_USER: '/iam/auth/v1/logged-user',
    LOGIN: '/iam/auth/v1/login',
    LOGIN_SSO: '/iam/auth/v1/login-sso',
    LOGIN_TOKEN: '/iam/auth/v1/login-token',
    LOGOUT: '/iam/auth/v1/logout',
    RENEW_TOKEN: '/iam/auth/v1/renew-token',
    VALIDATE_TOKEN: '/iam/auth/v1/validate-token',
  },

  PERMISSIONS: {
    READ: '/iam/permissions/v1/user-permissions',
    CREATE: '/iam/permissions/v1/permission'
  },

  USERS: {
    USER: '/iam/users/v1/user',
    RESET_PASS: {
      REQUEST: '/iam/users/v1/request-password-reset',
      CHANGE: '/iam/users/v1/change-password'
    },
    MY_ACCOUNT: '/iam/users/v1/my-account',
    PROFILES: '/iam/users/v1/profiles',
  },

  PROFILES: {
    PROFILE: '/iam/accessprofiles/v1/profile',
    MODULE: '/iam/accessprofiles/v1/module',
    PERMISSION: '/iam/accessprofiles/v1/permission',
  }

}