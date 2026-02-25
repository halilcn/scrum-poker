"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getUsernameCookie,
  getUserIdCookie,
  getRoomIdCookie,
} from "@/utils/cookieActions";
import FullPageLoader from "@/components/ui/FullPageLoader";

const withRedirectPage = (WrappedComponent) => {
  return function RedirectWrapper(props) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { hashId: urlHashId } = useParams();

    const checkPathname = (pathname) => {
      return window.location.pathname === pathname;
    };

    useEffect(() => {
      const checkAndRedirect = () => {
        const userId = getUserIdCookie();
        const username = getUsernameCookie();
        const roomId = getRoomIdCookie();

        // Eğer username ya da userid yok ise, login sayfasına yönlendir
        if (!userId || !username) {
          if (!checkPathname("/login")) {
            const isRoomUrl = window.location.pathname.includes("rooms");
            const roomIdFromUrl = isRoomUrl
              ? window.location.pathname.split("/")[2]
              : null;


            isRoomUrl
              ? router.push(`/login?roomId=${roomIdFromUrl}`)
              : router.push("/login");

            return true;
          }
        }

        // Eğer room id değeri yok ise, welcome-user'a yönlendir
        if (
          !roomId &&
          (!!userId || !!username) &&
          !window.location.pathname.includes("rooms")
        ) {
          if (!checkPathname("/welcome-user")) {
            router.push("/welcome-user");
            return true;
          }
        }

        // Eğer login sayfasındaysak ve userId ile username varsa, /welcome-user'a yönlendir
        if (checkPathname("/login") && userId && username) {
          if (!checkPathname("/welcome-user")) {
            router.push("/welcome-user");
            return true;
          }
        }

        // Eğer room id değeri var ise, rooms/:roomid sayfasına yönlendir
        if (!!urlHashId) {
          if (!checkPathname(`/rooms/${urlHashId}`)) {
            router.push(`/rooms/${urlHashId}`);
            return true;
          }
        }
      };

      const isRedirected = checkAndRedirect();
      !isRedirected && setLoading(false);
    }, [router]);

    if (loading) {
      return <FullPageLoader />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withRedirectPage;
