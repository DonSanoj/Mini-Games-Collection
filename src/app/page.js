'use client'

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

const dynamicLinks = [
  {
    title: 'Block Blast',
    href: '/BlockBlast',
    backgroundColor: '#5B99C2',
  },
  {
    title: 'Chess',
    href: '/Chess',
    backgroundColor: '#DFD3C3',
  },
  {
    title: 'Tic Tac Toe',
    href: '/TicTacToe',
    backgroundColor: '#A8C9A7',
  },
  {
    title: 'Word Puzzle',
    href: '/WordPuzzle',
    backgroundColor: '#D9B7D1',
  },
  {
    title: 'Sudoku',
    href: '/Sudoku',
    backgroundColor: '#87A6C2',
  },
  {
    title: 'Mahjong',
    href: '/Mahjong',
    backgroundColor: '#F3D9D1',
  },
  {
    title: 'Solitaire',
    href: '/Solitaire',
    backgroundColor: '#B5B5A0',
  },
  {
    title: 'Ball Shooting',
    href: '/BallShooting',
    backgroundColor: '#A7C4C2',
  },
  {
    title: 'Checkers',
    href: '/Checkers',
    backgroundColor: '#9CBAA2',
  },
  {
    title: 'Snake Game',
    href: '/SnakeGame',
    backgroundColor: '#E1B2A0',
  }
];

export default function Home() {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState({ showError: false, message: '' });

  useEffect(() => {
    //Check if username and age are already stored in localStorage
    const storedUsername = localStorage.getItem('username');
    const storedAge = localStorage.getItem('age');

    if (storedUsername && storedAge) {
      setUsername(storedUsername);
      setAge(storedAge);
      setSubmitted(true); //Skip the form if data is already stored
    }
  }, []);

  const handleSubmitUsername = (e) => {
    e.preventDefault();
    if (username.trim() === '' && age.trim() === '') {
      setFormError({ showError: true, message: 'Please enter details' });
    } else if (username.trim() === '') {
      setFormError({ showError: true, message: 'Please enter name' });
    } else if (age.trim() === '') {
      setFormError({ showError: true, message: 'Please enter age' });
    } else {

      //Store username and age in localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('age', age);

      setSubmitted(true);
      setFormError({ showError: false, message: '' });
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center">

      {formError.showError && (
        <div className={`absolute top-3 left-0 w-full flex items-center justify-center bg-opacity-50 z-30 transition-transform duration-700 ease-in-out transform ${formError.showError ? 'translate-y-0' : 'translate-y-[-100%]'}`}>
          <div className="p-3 bg-white border rounded-lg shadow-xl text-center flex flex-row gap-4 items-center justify-center">
            <p className="text-red-500">{formError.message}</p>
            <button
              onClick={() => setFormError({ showError: false, message: '' })}
              className="items-center justify-center"
            >
              <IoIosCloseCircle size={28} />
            </button>
          </div>
        </div>
      )}

      {!submitted ? (

        <div className="flex flex-col items-center z-10 relative bg-[#eee] p-5 rounded-xl">
          <p className="text-lg font-semibold mb-4">Welcome to Our Game Hub!</p>

          <form
            onSubmit={handleSubmitUsername}
            className="flex flex-col items-center z-10 relative bg-[#eee] p-5 rounded-xl"
          >
            <input
              type="text"
              placeholder="Enter your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded-lg mb-3"
            />
            <input
              type="text"
              placeholder="Enter your Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="mt-4 p-2 bg-blue-500 text-white rounded-lg w-full"
            >
              Submit
            </button>
          </form>

          <div className="mt-8 text-center">

            <p>After you submit your details, you will have access to a variety of exciting games.</p>
            <p>Choose to play with <span className=" text-lg font-semibold text-blue-500">Trixie</span>, our friendly AI, or challenge your friends in multiplayer mode.</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen overflow-x-hidden flex flex-col items-center">
          <Navbar username={username} />
          <div className="mt-24 flex flex-wrap justify-center gap-5 p-2">
            {dynamicLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <div
                  className="w-40 h-40 flex justify-center items-center rounded-xl cursor-pointer"
                  style={{
                    backgroundColor: link.backgroundColor, // Set dynamic background color
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'} // Hover color
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = link.backgroundColor} // Reset to initial color
                >
                  <h1 className="text-black text-[22px] font-semibold">{link.title}</h1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
