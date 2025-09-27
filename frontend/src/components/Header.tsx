import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import LanguageSwitcher from "./LanguageSwitcher";
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
  const { t } = useTranslation();

  const navLinks = [
    { name: t("nav.home"), link: "/" },
    { name: t("nav.services"), link: "/services" },
    { name: t("nav.community"), link: "/community" },
    { name: t("nav.resources"), link: "/resources" },
    { name: t("nav.nearme"), link: "/nearme" },
    { name: t("nav.profile"), link: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <Navbar className="">
        {/* Desktop Navbar */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navLinks} />
          <motion.div
            className="flex items-center gap-4 md:gap-5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="shrink-0">
              <LanguageSwitcher />
            </div>
            <NavbarButton href="/login" className="shrink-0">
              {t("cta.signup")}
            </NavbarButton>
          </motion.div>
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
            <div className="px-4">
              <LanguageSwitcher />
            </div>
            <NavbarButton href="/login" className="mt-4 w-full text-center">
              {t("cta.signup")}
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </header>
  );
};

export default Header;
