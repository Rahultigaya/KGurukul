const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[#648DB3] mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[#e5e8eb] text-md text-center md:text-left">
                    © {year} KGurukul&apos;s , All rights reserved.
                </p>

                <p className="text-[#e5e8eb] text-md text-center md:text-right cursor-pointer hover:underline">
                    Made With ❤️ in India
                </p>
            </div>
        </footer>
    );
};

export default Footer;