const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Service Tracking</h3>
            <p>Monitor your vehicle service progress in real-time.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Easy Appointment Booking</h3>
            <p>Book appointments effortlessly with our user-friendly interface.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-2">Modification Requests</h3>
            <p>Request custom modifications for your vehicle.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
            <p>Get instant help with our intelligent chatbot.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;