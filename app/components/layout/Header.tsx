"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { BookOpen, BarChart2, RotateCcw, Settings, LogOut, LogIn, Menu, X, Trophy } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: '/quiz', label: '퀴즈', icon: <BookOpen size={16} /> },
    { href: '/trends', label: '출제경향', icon: <BarChart2 size={16} /> },
    { href: '/wrong-review', label: '오답 복습', icon: <RotateCcw size={16} /> },
    { href: '/ranking', label: '랭킹', icon: <Trophy size={16} /> },
    { href: '/admin', label: '관리', icon: <Settings size={16} /> },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          정보처리기사
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <>
              <span className="text-sm text-gray-600">{session.user.name ?? session.user.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <LogIn size={16} />
              로그인
            </Link>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-md">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                onClick={() => setOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2">
              {session?.user ? (
                <button
                  onClick={() => { signOut(); setOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md w-full"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
                  onClick={() => setOpen(false)}
                >
                  <LogIn size={16} />
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
