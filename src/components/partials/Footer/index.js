"use client"
import Link from "next/link";
import NavMenu from "@/components/UI/NavMenu";
import menu from "@/data/menu.json";
import useAuthStore from "@/stores/authStore";

const Index = () => {
    const { isLogged, accountInfo, addToWishlist } = useAuthStore();
    return (
        <footer className="bg-black py-12 pl-6 pr-6">
            <div className="flex justify-between">
                <div className="p-6 w-[20%]">
                    <Link href="/">
                        <span className="font-semibold text-2xl font-bold text-white">mystore.</span>
                    </Link>
                </div>
                <div className="w-[20%]">
                    
                    <NavMenu menu={menu} color="white" />
                </div>
            </div>
        </footer>
    );
}

export default Index;
