// // import { useState } from 'react';

// // // 1. Capitalize the import names so React recognizes them as components
// // import Welcome from './pages/welcome';
// // import SignIn from './pages/sign-in';
// // import SignUp from './pages/sign-up';

// // function App() {
// //   // 2. Set up a state variable to control which screen is active
// //   const [screen, setScreen] = useState('welcome'); // Can be 'welcome', 'signin', or 'signup'

// //   return (
// //     <div style={{ fontFamily: 'sans-serif', padding: '20px' }}> 
// //       <h1>Hi, Welcome to the page.</h1>

// //       {/* Temporary Navigation bar so you can click and test your designs */}
// //       <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
// //         <button onClick={() => setScreen('welcome')}>Show Welcome</button>
// //         <button onClick={() => setScreen('signin')}>Show Sign In</button>
// //         <button onClick={() => setScreen('signup')}>Show Sign Up</button>
// //       </nav>

// //       <hr style={{ marginBottom: '20px' }} />

// //       {/* 3. Conditionally render the component based on the active screen state */}
// //       {screen === 'welcome' && <Welcome />}
// //       {screen === 'signin' && <SignIn />}
// //       {screen === 'signup' && <SignUp />}
// //     </div>
// //   );
// // }

// // export default App;


// import { useState } from "react";
// import WelcomePage from "./pages/WelcomePage";
// import SignInPage from "./pages/SignInPage";
// import SignUpPage from "./pages/SignUpPage";
// import HomePage from "./pages/HomePage";

// export default function App() {
//   const [page, setPage] = useState("welcome");
//   const Page = { welcome: WelcomePage, signin: SignInPage, signup: SignUpPage }[page];
//   return <Page onNavigate={setPage} />;
// }



import { useState } from "react";
import WelcomePage from "./pages/WelcomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const [page, setPage] = useState("welcome");

  const Page = {
    welcome: WelcomePage,
    signin: SignInPage,
    signup: SignUpPage,
    home: HomePage,
  }[page];

  return <Page onNavigate={setPage} />;
}
