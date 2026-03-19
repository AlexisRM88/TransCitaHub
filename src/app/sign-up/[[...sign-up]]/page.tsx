import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 font-sans p-4">
      <div className="flex flex-col items-center">
        <SignUp />
      </div>
    </div>
  );
}
