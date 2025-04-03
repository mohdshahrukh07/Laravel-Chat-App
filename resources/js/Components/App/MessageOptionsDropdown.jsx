import axios from "axios";
import { Fragment } from "react";
import {
    EllipsisVerticalIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    TrashIcon,
    UserIcon,
} from "@heroicons/react/24/solid";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
export default function MessageOptionsDropdown({ message }) {
    const onMessageDelete = () => {
        console.log("delete messasge");
        axios
            .delete(route("message.destroy", message.id))
            .then((res) => {
                emit("message.deleted",message);
                console.log(res.data);
            }).catch((err) => {
                console.error(err);
            });
    }
    return (
        <div className="absolute right-full text-gray-100 top-1/2 -translate-y-1/2 z-10">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40" >
                        <EllipsisVerticalIcon className="h-5 w-5" /></MenuButton>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition easy-in duration-75"
                >
                    <MenuItems className="absolute left-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-[100]">
                        <div className="px-1 py-1">
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`${active
                                                ? "bg-black/30 text-white"
                                                : "text-gray-100"
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                <TrashIcon className="w-4 h-4 mr-2" />
                                                Delete
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
        </div>
    )
}