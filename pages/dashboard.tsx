import Navbar from "../components/navbar";
const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Graduate Dashboard
          </h2>
          <p className="text-center text-gray-600">
            Welcome to your graduate dashboard!
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
