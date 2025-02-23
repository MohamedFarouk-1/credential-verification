import React from "react";

const Register = () => {
  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form>
        <input type="text" className="form-control mb-3" placeholder="Full Name" />
        <input type="email" className="form-control mb-3" placeholder="Email" />
        <input type="password" className="form-control mb-3" placeholder="Password" />
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
