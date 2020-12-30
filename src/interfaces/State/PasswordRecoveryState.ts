interface PasswordRecoveryState {
    id: string;
      requested: boolean;
      password: string;
      token: string;
}

export default PasswordRecoveryState
