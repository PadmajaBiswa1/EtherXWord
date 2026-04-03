// export default function Signup() {
//   return (
//     <div>
//       <h1>Sign Up Page</h1>
//     </div>
//   );
// }
import { useState } from "react";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );

      alert("User registered successfully ✅");
      console.log(res.data);

    } catch (err) {
      console.error(err);
      alert("Signup failed ❌");
    }
  };

//   return (
//     <div className="signup-container">
//       <form className="signup-box" onSubmit={handleSubmit}>
//         <h2>Create Account</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           required
//         />

//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// }

// export default function Signup() {
  return (
    <div className="container">
      <div className="card">
        <div className="logo">ETHERX WORD</div>

        <h2>Create Account</h2>
        <p className="subtitle">
          Join thousands of users creating amazing documents
        </p>

        <form>
          <div className="row">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>

          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />

          <button type="submit">Sign Up with OTP</button>
        </form>

        <p className="footer">
          Already have an account? <span>Login</span>
        </p>
      </div>
    </div>
  );
}
