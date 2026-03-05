import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';

const AuthContext = createContext(null);

const SESSION_DURATION = 5 * 60; // 5 minutes

export function AuthProvider({ children }) {
  const timerRef = useRef(null);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cartify_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [sessionSeconds, setSessionSeconds] = useState(SESSION_DURATION);

  // ---------------------------
  // SESSION TIMER
  // ---------------------------
  useEffect(() => {
    if (!user) return;

    let expiry = localStorage.getItem('cartify_session_expiry');

    if (!expiry) {
      expiry = Date.now() + SESSION_DURATION * 1000;
      localStorage.setItem('cartify_session_expiry', expiry);
    }

    const updateTimer = () => {
      const remaining = Math.floor((expiry - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        logout();
        return;
      }

      setSessionSeconds(remaining);
    };

    updateTimer();

    timerRef.current = setInterval(updateTimer, 1000);

    return () => clearInterval(timerRef.current);
  }, [user]);

  // ---------------------------
  // LOGIN
  // ---------------------------
  const login = useCallback((email, password) => {
    const users = JSON.parse(localStorage.getItem('cartify_users') || '[]');

    /* Step 1: check if the email is registered at all */
    const emailMatch = users.find((u) => u.email === email);

    if (!emailMatch) {
      const err = new Error(
        'No account found with this email. Please register first.'
      );
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    /* Step 2: email exists — now check password */
    if (emailMatch.password !== password) {
      const err = new Error('Incorrect password. Please try again.');
      err.code = 'WRONG_PASSWORD';
      throw err;
    }

    const { password: _p, ...safeUser } = emailMatch;

    localStorage.setItem('cartify_user', JSON.stringify(safeUser));

    const expiry = Date.now() + SESSION_DURATION * 1000;
    localStorage.setItem('cartify_session_expiry', expiry);

    setSessionSeconds(SESSION_DURATION);
    setUser(safeUser);

    return safeUser;
  }, []);

  // ---------------------------
  // REGISTER
  // ---------------------------
  const register = useCallback((name, email, password) => {
    const users = JSON.parse(localStorage.getItem('cartify_users') || '[]');

    if (users.find((u) => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password
    };

    users.push(newUser);

    localStorage.setItem('cartify_users', JSON.stringify(users));

    const { password: _p, ...safeUser } = newUser;

    localStorage.setItem('cartify_user', JSON.stringify(safeUser));

    const expiry = Date.now() + SESSION_DURATION * 1000;
    localStorage.setItem('cartify_session_expiry', expiry);

    setSessionSeconds(SESSION_DURATION);
    setUser(safeUser);

    return safeUser;
  }, []);

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const logout = useCallback(() => {
    clearInterval(timerRef.current);

    localStorage.removeItem('cartify_user');
    localStorage.removeItem('cartify_session_expiry');

    setUser(null);
    setSessionSeconds(0);
  }, []);

  // ---------------------------
  // UPDATE PROFILE
  // ---------------------------
  const updateProfile = useCallback(
    (updates) => {
      if (!user) return;

      const users = JSON.parse(localStorage.getItem('cartify_users') || '[]');

      const idx = users.findIndex((u) => u.id === user.id);

      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem('cartify_users', JSON.stringify(users));
      }

      const updatedUser = { ...user, ...updates };

      delete updatedUser.password;

      localStorage.setItem('cartify_user', JSON.stringify(updatedUser));

      setUser(updatedUser);
    },
    [user]
  );

  // ---------------------------
  // FORMAT TIMER
  // ---------------------------
  const formatTimer = () => {
    const m = Math.floor(sessionSeconds / 60)
      .toString()
      .padStart(2, '0');

    const s = (sessionSeconds % 60).toString().padStart(2, '0');

    return `${m}:${s}`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        sessionSeconds,
        formatTimer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
