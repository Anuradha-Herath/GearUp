const LandingFooter = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">AutoServe</h3>
            <p>Your automobile service partner.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <h4 className="text-lg font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300 transition duration-300">About</a></li>
              <li><a href="#" className="hover:text-gray-300 transition duration-300">Contact</a></li>
              <li><a href="#" className="hover:text-gray-300 transition duration-300">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-gray-300 transition duration-300">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="mt-4 md:mt-0">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300 transition duration-300">Facebook</a>
              <a href="#" className="hover:text-gray-300 transition duration-300">Twitter</a>
              <a href="#" className="hover:text-gray-300 transition duration-300">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;