import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";

// import { getToken } from "next-auth/jwt";
// import { withAuth } from "next-auth/middleware";

// export default async function middleware(req, event) {
//   if (req.nextUrl.pathname === "/log-in" || req.nextUrl.pathname === "/sign-up") {
//     const currentUrl = req.nextUrl.clone();

//     const session = await getToken({
//       req,
//       secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
//     });

//     if (session) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     return NextResponse.rewrite(currentUrl);
//   }

//   const authMiddleware = withAuth({
//     secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
//     pages: {
//       signIn: "/log-in",
//       error: "/error-auth",
//     },
//   });

//   return authMiddleware(req, event);
// }

export default async function middleware(req, res) {
  const currentUrl = req.nextUrl.clone();

  const getToken = getCookie("TOKEN", { req, res });
  const getRefreshToken = getCookie("REFRESH_TOKEN", { req, res });

  if (req.nextUrl.pathname === "/log-in" || req.nextUrl.pathname === "/sign-up") {
    if (getToken && getRefreshToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.rewrite(currentUrl);
  }

  if (req.nextUrl.pathname === "/checkout" || req.nextUrl.pathname === "/checkout-flashsale") {
    if (getToken && getRefreshToken) {
      let isHaveCart;

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.payload && response.payload.length > 0) {
            isHaveCart = true;
          } else {
            isHaveCart = false;
          }
        })
        .catch(() => {
          isHaveCart = false;
        });

      if (isHaveCart) {
        return NextResponse.rewrite(currentUrl);
      }

      NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.redirect(new URL("/log-in", req.url));
  }

  if (getToken && getRefreshToken) {
    return NextResponse.rewrite(currentUrl);
  }

  return NextResponse.redirect(new URL("/log-in", req.url));
}

export const config = {
  matcher: ["/cart", "/wish-list", "/account/:path*", "/log-in", "/sign-up", "/checkout", "/checkout-flashsale"],
};
