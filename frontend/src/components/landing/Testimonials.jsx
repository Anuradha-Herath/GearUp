const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>"Great service! Easy to track my car's maintenance."</p>
            <p className="mt-4 font-semibold">- John Doe</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>"Booking appointments has never been simpler."</p>
            <p className="mt-4 font-semibold">- Jane Smith</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>"The AI chatbot is incredibly helpful."</p>
            <p className="mt-4 font-semibold">- Bob Johnson</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;