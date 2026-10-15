// // import { useState } from "react";
// // import AuthAside from "../components/AuthAside";
// // import Field from "../components/Field";

// // export default function SignUpPage({ onNavigate = () => {} }) {
// //   const [f, setF] = useState({ name: "", email: "", password: "" });
// //   const [errs, setErrs] = useState({});
// //   const [busy, setBusy] = useState(false);
// //   const [done, setDone] = useState(false);

// //   const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

// //   const submit = (e) => {
// //     e.preventDefault();
// //     const x = {};
// //     if (!f.name.trim()) x.name = "Enter your name.";
// //     if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Enter a valid email address.";
// //     if (f.password.length < 8) x.password = "Use at least 8 characters.";
// //     setErrs(x);
// //     if (Object.keys(x).length) return;
// //     setBusy(true);
// //     // TODO: replace with your real sign-up request
// //     setTimeout(() => { setBusy(false); setDone(true); }, 900);
// //   };

// //   return (
// //     <div className="shell">
// //       <AuthAside headline="Start small. Finish big." />
// //       <main className="main">
// //         <form className="panel" onSubmit={submit} noValidate>
// //           <button type="button" className="back" onClick={() => onNavigate("signin")}>← Back</button>
// //           <h1>Create your account</h1>
// //           <p className="sub">It takes less than a minute.</p>

// //           <Field label="Name" autoComplete="name"
// //             value={f.name} onChange={set("name")} error={errs.name} />
// //           <Field label="Email" type="email" autoComplete="email"
// //             value={f.email} onChange={set("email")} error={errs.email} />
// //           <Field label="Password" password autoComplete="new-password"
// //             value={f.password} onChange={set("password")} error={errs.password} />

// //           <button className="cta" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
// //           {done && <p className="ok" role="status">Account created. Welcome to Nuggets!</p>}
// //         </form>
// //       </main>
// //     </div>
// //   );
// // }





// import { useState } from "react";
// import AuthAside from "../components/AuthAside";
// import Field from "../components/Field";

// export default function SignUpPage({ onNavigate = () => {} }) {
//   const [f, setF] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const [errs, setErrs] = useState({});
//   const [busy, setBusy] = useState(false);
//   const [done, setDone] = useState(false);

//   const set = (k) => (e) =>
//     setF({ ...f, [k]: e.target.value });

//   const submit = async (e) => {
//     e.preventDefault();

//     const x = {};

//     if (!f.name.trim()) {
//       x.name = "Enter your name.";
//     }

//     if (!/^\S+@\S+\.\S+$/.test(f.email)) {
//       x.email = "Enter a valid email address.";
//     }

//     if (f.password.length < 8) {
//       x.password = "Use at least 8 characters.";
//     }

//     setErrs(x);
//     setDone(false);

//     if (Object.keys(x).length > 0) {
//       return;
//     }

//     setBusy(true);

//     try {
//       // Send form data to the backend
//       const response = await fetch(
//         "http://localhost:5000/api/auth/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(f)
//         }
//       );

//       // Read the backend response
//       const result = await response.json();

//       // Check whether registration succeeded
//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Registration failed"
//         );
//       }

//       // Show success message
//       setDone(true);
//       onNavigate("signin");

//       // Clear the form
//       setF({
//         name: "",
//         email: "",
//         password: ""
//       });

//     } catch (error) {
//       setErrs({
//         general:
//           error.message === "Failed to fetch"
//             ? "Cannot connect to the server. Please try again."
//             : error.message
//       });
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="shell">
//       <AuthAside headline="Start small. Finish big." />

//       <main className="main">
//         <form
//           className="panel"
//           onSubmit={submit}
//           noValidate
//         >
//           <button
//             type="button"
//             className="back"
//             onClick={() => onNavigate("signin")}
//           >
//             ← Back
//           </button>

//           <h1>Create your account</h1>

//           <p className="sub">
//             It takes less than a minute.
//           </p>

//           <Field
//             label="Name"
//             autoComplete="name"
//             value={f.name}
//             onChange={set("name")}
//             error={errs.name}
//           />

//           <Field
//             label="Email"
//             type="email"
//             autoComplete="email"
//             value={f.email}
//             onChange={set("email")}
//             error={errs.email}
//           />

//           <Field
//             label="Password"
//             password
//             autoComplete="new-password"
//             value={f.password}
//             onChange={set("password")}
//             error={errs.password}
//           />

//           {errs.general && (
//             <p className="error" role="alert">
//               {errs.general}
//             </p>
//           )}

//           <button className="cta" disabled={busy}>
//             {busy ? "Creating..." : "Create account"}
//           </button>

//           {done && (
//             <p className="ok" role="status">
//               Account created. Welcome to Nuggets!
//             </p>
//           )}
//         </form>
//       </main>
//     </div>
//   );
// }






import { useState } from "react";
import AuthAside from "../components/AuthAside";
import Field from "../components/Field";

export default function SignUpPage({ onNavigate = () => {} }) {
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setF({ ...f, [key]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!f.name.trim()) {
      errors.name = "Enter your name.";
    }

    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (f.password.length < 8) {
      errors.password = "Use at least 8 characters.";
    }

    setErrs(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(f),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Registration failed."
        );
      }

      // Clear the form and navigate to Sign In.
      setF({
        name: "",
        email: "",
        password: "",
      });

      setErrs({});
      onNavigate("signin");
    } catch (error) {
      setErrs({
        general:
          error.message === "Failed to fetch"
            ? "Cannot connect to the server. Please try again."
            : error.message,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="shell">
      <AuthAside headline="Start small. Finish big." />

      <main className="main">
        <form
          className="panel"
          onSubmit={submit}
          noValidate
        >
          <button
            type="button"
            className="back"
            onClick={() => onNavigate("signin")}
          >
            ← Back
          </button>

          <h1>Create your account</h1>
          <p className="sub">
            It takes less than a minute.
          </p>

          <Field
            label="Name"
            autoComplete="name"
            value={f.name}
            onChange={set("name")}
            error={errs.name}
          />

          <Field
            label="Email"
            type="email"
            autoComplete="email"
            value={f.email}
            onChange={set("email")}
            error={errs.email}
          />

          <Field
            label="Password"
            password
            autoComplete="new-password"
            value={f.password}
            onChange={set("password")}
            error={errs.password}
          />

          {errs.general && (
            <p className="error" role="alert">
              {errs.general}
            </p>
          )}

          <button className="cta" disabled={busy}>
            {busy ? "Creating..." : "Create account"}
          </button>

          <p className="swap">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("signin")}
            >
              Sign in
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}

