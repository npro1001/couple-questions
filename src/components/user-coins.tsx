"use client";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";

export default function UserCoins() {
  const qCoins = useUserStore((state) => state.qCoins);
  const loading = useUserStore((state) => state.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // <div className="flex flex-row gap-2 shadow-md p-4 rounded-md">
    //   <div className="flex justify-center w-full gap-2 p-1 ">
    //     <span className="font-semibold">{qCoins}</span>
    //     <Image src="/coin.png" alt="q-coin-image" width={25} height={25} />
    //   </div>
    //   <div className="flex justify-center w-full gap-2 p-1">
    //     <span className="font-semibold">5</span>
    //     <Image src="/skip.png" alt="q-coin-image" width={25} height={25} />
    //   </div>
    // </div>
    <div className="flex flex-col md:flex-row items-center gap-2 justify-center align-middle shadow-md p-4 rounded-md">
      {/* Coin 1 */}
      <div className="flex flex-col space-x-1 md:flex-row items-center">
        <span className="font-semibold">{qCoins}</span>
        <Image src="/coin.png" alt="q-coin-image" width={25} height={25} />
      </div>
      {/* Coin 2 */}
      <div className="flex flex-col space-x-1 md:flex-row items-center">
        <span className="font-semibold">5</span>
        <Image src="/skip.png" alt="q-coin-image" width={25} height={25} />
      </div>
    </div>
  );
}
