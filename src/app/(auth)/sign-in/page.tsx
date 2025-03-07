"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignIn() {
  const { data: Session } = useSession();
  if (Session) {
    return (
      <>
        Signed in as {Session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
