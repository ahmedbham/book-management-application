import AuthButton from './components/AuthButton'; // Adjust path if needed

    export default function Home() {
      return (
        <div className="container flex flex-col items-center justify-center min-h-screen py-2 mx-auto">
          <header className="flex justify-end w-full p-4">
             <AuthButton />
          </header>
          <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
            <h1 className="text-4xl font-bold">
              Welcome to the Book Management System
            </h1>
            {/* Add other content here */}
          </main>
        </div>
      );
    }