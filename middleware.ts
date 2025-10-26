import auth from "next-auth/middleware";

export default auth;

export const config = {
  matcher: ["/issues/new", "/issues/edit/:id+"],
};