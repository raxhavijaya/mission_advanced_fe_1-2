import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const movieGenres = [
    "Aksi",
    "Komedi",
    "Horor",
    "Drama",
    "Romantis",
    "Sci-Fi",
    "Petualangan",
    "Fantasi",
  ];

  const helpLinks = [
    { name: "FAQ", href: "#" },
    { name: "Kontak Kami", href: "#" },
    { name: "Privasi", href: "#" },
    { name: "Syarat & Ketentuan", href: "#" },
  ];

  return (
    <footer className="mt-20 mb-6">
      <div className=" w-[95%] mx-auto rounded-4xl bg-white/15 backdrop-blur-md px-7 py-12 shadow-2xl border border-white/20">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            
            <a href="/home">
              <img src="/logo.png" alt="Logo" className="w-28" />
            </a>
            <p className="text-sm mt-10  text-white/70">
              Platform streaming film terbaik untuk menemani hari-harimu.
            </p>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Genre Film
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {movieGenres.map((genre) => (
                <li key={genre}>
                  <a
                    href="#"
                    className="text-white/90 hover:text-blue-400 transition-colors duration-200"
                  >
                    {genre}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Grid 3: Bantuan */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Bantuan</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/90 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Garis Pemisah dan Copyright */}
        <div className="mt-10 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-white/70">
            &copy; {currentYear} Chill. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
