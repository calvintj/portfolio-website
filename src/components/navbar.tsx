import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
// import { FaWhatsapp } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-center py-6">
      <div className="m-8 flex items-center justify-center gap-4 text-2xl">
        <a href="https://www.linkedin.com/in/calvinhendra">
          <FaLinkedin />
        </a>
        <a href="https://github.com/calvintj">
          <FaGithub />
        </a>
        <a href="https://www.instagram.com/calvintjj">
          <FaInstagram />
        </a>
        {/* <a href="https://wa.me/+6281265571198">
          <FaWhatsapp />
        </a> */}
        <a href="mailto:calvinhendra330@gmail.com">
          <FaEnvelope />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
