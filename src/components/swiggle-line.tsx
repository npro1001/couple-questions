const SquiggleBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-[-1] bg-gray-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
        className="absolute w-full h-auto top-1/2 "
      >
        <path
          d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"
          stroke="black"
          fill="none"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};

export default SquiggleBackground;
