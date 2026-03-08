import './globals.css'
import Header from './components/layout/Header'
import Providers from './providers'

export const metadata = {
  title: '정보처리기사 시험 대비',
  description: 'AI 기반 정보처리기사 시험 대비 앱 - 기출문제, 출제경향 분석, AI 해설',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-57px)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
