import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import BottomNav from '../components/BottomNav'

export default async function HomePage() {
  const today = new Date().toISOString().slice(0, 10)

  const { data: choices } = await supabase
    .from('dinner_choices')
    .select('*')
    .eq('date', today)

  const todayChoice = choices?.[0]

  return (
    <main
      style={{
        padding: '16px',
paddingBottom: '90px',
maxWidth: '520px',
margin: '0 auto',
width: '100%',
boxSizing: 'border-box',
        background: '#fffaf3',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
        🍽 오늘의 저녁
      </h1>

      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '18px',
          marginTop: '20px',
        }}
      >
        <p>오늘 선택한 메뉴</p>
<h2>{todayChoice?.menu_name || '아직 선택 안 함'}</h2>

        <Link href="/menu">
          <button
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '15px',
              borderRadius: '15px',
              border: 'none',
              background: 'orange',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            메뉴 고르기
          </button>
        </Link>
      </div>

      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '20px',
          marginTop: '20px',
        }}
      >
        <h2>🧊 냉장고 알림</h2>

        <ul>
          <li>두부 D-1</li>
          <li>계란 2개 남음</li>
          <li>우유 D-2</li>
        </ul>
      </div>

      <BottomNav />
    </main>
  )
}