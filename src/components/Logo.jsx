import logo from "../assets/logo.png";

/* Growth Local logo — the client-supplied PNG (white text on transparent,
   designed for the dark header). */
const Logo = () => (
  <img
    src={logo}
    alt="Growth Local"
    style={{ height: 46, width: "auto", display: "block" }}
  />
);

export default Logo;
