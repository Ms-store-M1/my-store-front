import Link from 'next/link';
import NavMenu from "@/components/UI/NavMenu";
import menu from "@/data/menu.json";

const Index = ({ userId, isAdmin }) => {
    // Function to generate dynamic URL for orders page
    const generateOrdersUrl = () => {
        if (!isAdmin) {
            // If the user is not an admin, append the user's ID as a query parameter
            return `/orders?user=${userId}`;
        }
        // If the user is an admin or if userId is not available, return the default URL
        return "/orders";
    };

    // Modify the "Orders" menu item to use the generated URL
    const modifiedMenu = menu.map(item => {
        if (item.label === "Orders") {
            return { ...item, url: generateOrdersUrl() };
        }
        return item;
    });

    return (
        <header className="bg-white border-b border-color-black">
            <ul className="flex pl-6 pr-6 items-center justify-between">
                <li className="flex lg:flex-1">
                    <Link href="/">
                        <span className="font-semibold text-2xl font-bold">mystore.</span>
                    </Link>
                </li>
                <li>
                    {/* Use the modified menu with the updated "Orders" URL */}
                    <NavMenu menu={modifiedMenu} color="grey" />
                </li>
            </ul>
        </header>
    );
}

export default Index;