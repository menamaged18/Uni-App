"use client";
import Admins from "@/components/Rules/Admins";
import Student from "@/components/Rules/Student";
import { useAppSelector } from "@/services/store/storeHooks";

export default function Home() {
  const {data:user} = useAppSelector(state => state.users.currentUser)
  let content;

  if (user?.role === 'STUDENT' || user?.role === null || user?.role === undefined) {
    content = <Student />;
  }

  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
    content = <Admins />
  }
  

  return (
    <>
      {content}  
    </>
  );
}
