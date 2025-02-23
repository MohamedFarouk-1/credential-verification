import React from "react";

const Login = () => {
  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form>
        <input type="email" className="form-control mb-3" placeholder="Email" />
        <input type="password" className="form-control mb-3" placeholder="Password" />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
