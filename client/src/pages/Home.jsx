import Header from "../components/Header";
import { Navbar } from "../components/Navbar";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center  min-h-screen bg-gradient-to-b from-white to-blue-50 relative ">
      <Navbar />
      <Header />
      {/* <h1>Home</h1> */}
    </div>
  );
};

export default Home;
