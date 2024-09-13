// "use client";
// import React, { useEffect, useState } from "react";
// import { Canvas, useLoader } from "@react-three/fiber";
// import { OrbitControls, Html, RoundedBox, SpotLight } from "@react-three/drei";
// import { TextureLoader } from "three";

// export function LightStrip() {
//   return (
//     <>
//       <SpotLight
//         position={[0, -3, 0]}
//         angle={3.5}
//         penumbra={1}
//         intensity={10}
//         distance={10}
//         color="#ffffff"
//       />
//     </>
//   );
// }

// export default function Card3D() {
//   //   return (
//   // <div className="flex flex-col items-center justify-center border-black border mx-[25%] min-w-[450px] min-h-[250px]">
//   //   <p>Start</p>
//   // </div>
//   //   );

//   //   const [text, setText] = useState("Lets run it!");
//   const [rotation, setRotation] = useState([0, 0, 0]);
//   const texture = useLoader(TextureLoader, "/texture2.jpeg"); // Assuming you have a card texture

//   useEffect(() => {
//     const handleMouseMove = (event) => {
//       const x = (event.clientX / window.innerWidth) * 2 - 1;
//       const y = -(event.clientY / window.innerHeight) * 2 + 1;
//       setRotation([y * 0.2, x * 0.2, 0]);
//     };

//     window.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   return (
//     <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
//       <ambientLight />
//       <pointLight position={[14, 8, 10]} />
//       <OrbitControls
//         minDistance={10}
//         maxDistance={10}
//         enableZoom={false}
//         enablePan={false}
//         enableRotate={false}
//       />
//       {texture && (
//         <RoundedBox
//           args={[8, 4, 0.1]}
//           radius={0.2}
//           smoothness={4}
//           rotation={rotation}
//         >
//           <meshStandardMaterial
//             color="#1e293b" // Set the color
//             roughness={1} // Adjust roughness
//             metalness={0.1} // Adjust metalness for more metallic look
//             emissive="#1e293b" // Emissive color to match the base color
//             emissiveIntensity={0.9} // Intensity of the emissive light
//             flatShading={false} // Flat shading off for smooth appearance
//             lightMapIntensity={1} // Adjust light map intensity
//           />
//           <Html position={[0, 0, 0.1]} transform occlude>
//             <div className="flex flex-col items-center">
//               <h2 className="font-playwrite text-3xl mb-5">Couple Questions</h2>
//               <button
//                 className="btn btn-xs btn-base-300 hover:btn-primary"
//                 onClick={() => {
//                   console.log("Hi");
//                 }}
//               >
//                 New Game
//               </button>
//             </div>
//           </Html>
//         </RoundedBox>
//       )}
//       <LightStrip />
//     </Canvas>
//   );
// }
