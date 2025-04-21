export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-2">
      {" "}
      {/* Adjusted min-height */}
      {/* Header removed as AuthButton is now in NavBar */}
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold">
          Welcome to the Book Management System
        </h1>
        {/* Add other content here */}
        <p className="mt-4 text-lg">
          Use the navigation bar above to browse books or manage your
          collection.
        </p>
      </main>{" "}
      {/* Correctly close the main tag */}
    </div>
  );
}
