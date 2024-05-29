import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";

function Footer() {
  return (
    <footer>
      <Container>
        <div className="d-flex justify-content-between flex-column flex-md-row flex-wrap pt-5 pb-4">
          <motion.div
            initial={{ x: -200 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            <img
              src={require("../images/logo/Barito_logo.png")}
              alt="logo"
              className="mb-3"
              style={{ width: '200px', height: 'auto' }}
            />
            <p className="gray-100">
              Silakan hubungi kami jika anda memiliki <br /> pertanyaan.
            </p>
            <Link to="mailto:baritominisoccer@gmail.com" className="link-primary link-underline-opacity-0">
              baritominisoccer@gmail.com
            </Link>
          </motion.div>
          <span className="d-block d-md-none"></span>
          <motion.div
            initial={{ x: 200 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8 }}
            className="d-flex"
          >
            <div className="me-5">
              <h6 className="gray-100 text-uppercase mb-2 fw-normal">
                Quick Link
              </h6>
              <ul className="p-0">
                <li>
                  <HashLink to={"/#about"} className="text-white">
                    About Us
                  </HashLink>
                </li>
                <li>
                  <HashLink to={"/#location"} className="text-white">
                    Location
                  </HashLink>
                </li>
                <li>
                  <HashLink to={"/calendar#"} className="text-white">
                    Calendar
                  </HashLink>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="gray-100 text-uppercase mb-2 fw-normal">
                Contact
              </h6>
              <a href="https://wa.me/6287711569168" className="text-white fw-light">+62 877-1156-9168</a>
              <br />
              <a href="mailto:baritominisoccer@gmail.com" className="text-white fw-light">baritominisoccer@gmail.com</a>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="d-flex justify-content-between flex-column flex-md-row flex-wrap gray-100 pt-3"
        >
          <p>© 2024 YHNS. All rights reserved</p>
          <p>
            Design by{" "}
            <Link className="link-primary link-underline-opacity-0" to={""}>
              YHNS
            </Link>
          </p>
        </motion.div>
      </Container>
    </footer>
  );
}

export default Footer;
