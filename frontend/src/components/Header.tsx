import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
  NavbarButton,
} from "./ui/resizable-navbar";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "#about" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "#contact" },
    { name: "Resources", link: "#resources" },
    { name: "Therapists", link: "#therapists" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <Navbar className="">
        {/* Desktop Navbar */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navLinks} />
          <NavbarButton href="#signup">Sign Up</NavbarButton>
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navLinks.map((item, idx) =>
              item.link.startsWith("/") ? (
                <Link
                  key={idx}
                  to={item.link}
                  className="w-full px-4 py-2 text-lg text-neutral-700 dark:text-neutral-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={idx}
                  href={item.link}
                  className="w-full px-4 py-2 text-lg text-neutral-700 dark:text-neutral-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              )
            )}
            <NavbarButton href="#signup" className="mt-4 w-full text-center">
              Sign Up
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </header>
  );
};

export default Header;
