import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Scenario } from "../components/Scenario";
import { ChatInterface } from "../components/ChatInterface";

function Bot() {
  return (
    <>
      <div className="w-screen h-screen bg-[url('/textures/backgroundBot.jpg')] bg-cover bg-center bg-no-repeat">


        <Loader />
        <Leva collapsed hidden />
        <ChatInterface />
        <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
          <Scenario />
        </Canvas>
      </div>
    </>
  );
}

export default Bot;
