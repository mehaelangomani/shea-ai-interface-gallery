/**
 * OBJECT AI — Mock authentication (localStorage).
 */

(function () {
  const USER_KEY = 'objectai_users';
  const SESSION_KEY = 'objectai_session';
  const PLAN_KEY = 'objectai_plan';

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USER_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function setSession(email) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loggedIn: true }));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session?.loggedIn || !session.email) return null;
    return getUsers().find((u) => u.email === session.email) || null;
  }

  function register({ name, email, password }) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    users.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    setSession(email.trim().toLowerCase());
    return { ok: true };
  }

  function login({ email, password }) {
    const user = getUsers().find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    setSession(user.email);
    return { ok: true };
  }

  function logout() {
    clearSession();
  }

  function isLoggedIn() {
    return !!getCurrentUser();
  }

  function getInitial(name) {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
  }

  function setActivePlan(plan) {
    localStorage.setItem(PLAN_KEY, plan);
  }

  function getActivePlan() {
    return localStorage.getItem(PLAN_KEY) || 'free';
  }

  window.ObjectAIAuth = {
    register,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    getInitial,
    setActivePlan,
    getActivePlan,
  };
})();
