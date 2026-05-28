import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import BottomNav from '../../components/BottomNav'

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const params = await searchParams

  const today = new Date()

  const currentMonth =
    params.month ||
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  const [yearText, monthTextOnly] = currentMonth.split('-')

  const year = Number(yearText)
  const month = Number(monthTextOnly)

  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)

  const prevMonthDate = new Date(year, month - 2, 1)
  const nextMonthDate = new Date(year, month, 1)

  const prevMonth = `${prevMonthDate.getFullYear()}-${String(
    prevMonthDate.getMonth() + 1
  ).padStart(2, '0')}`

  const nextMonth = `${nextMonthDate.getFullYear()}-${String(
    nextMonthDate.getMonth() + 1
  ).padStart(2, '0')}`

  const monthText = `${year}-${String(month).padStart(2, '0')}`
  const startDate = `${monthText}-01`
  const endDate = `${monthText}-${String(lastDay.getDate()).padStart(2, '0')}`

  const { data: choices } = await supabase
    .from('dinner_choices')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .eq('person', '현정')
    .order('date', { ascending: true })

  const menuCount: Record<string, number> = {}

  choices?.forEach((choice) => {
    if (!choice.menu_name) return
    menuCount[choice.menu_name] = (menuCount[choice.menu_name] || 0) + 1
  })

  const topMenus = Object.entries(menuCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const emptyDays = Array.from({ length: firstDay.getDay() }, (_, i) => i)

  const days = Array.from({ length: lastDay.getDate() }, (_, i) => {
    const day = i + 1
    return `${monthText}-${String(day).padStart(2, '0')}`
  })

  return (
    <main
      style={{
        padding: '16px',
        paddingBottom: '90px',
        maxWidth: '520px',
        width: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
        background: '#fffaf3',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
        📅 저녁 기록
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          marginBottom: '10px',
        }}
      >
        <Link href={`/calendar?month=${prevMonth}`}>◀ 이전달</Link>

        <strong>
          {year}년 {month}월
        </strong>

        <Link href={`/calendar?month=${nextMonth}`}>다음달 ▶</Link>
      </div>

      <p
  style={{
    color: '#666',
    textAlign: 'center',
    marginTop: '8px',
  }}
>
  {year}년 {month}월에 먹은 저녁 기록이에요.
</p>

      <section
        style={{
          background: 'white',
          padding: '18px',
          borderRadius: '20px',
          marginTop: '20px',
        }}
      >
        <h2 style={{ marginTop: 0 }}>🏆 이번 달 TOP 3</h2>

        {topMenus.length === 0 ? (
          <p style={{ color: '#666' }}>아직 기록이 없어요.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {topMenus.map(([name, count], index) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '16px',
                  background: index === 0 ? '#fff0d9' : '#f7f7f7',
                  fontWeight: 'bold',
                }}
              >
                <span>
                  {index === 0 && '🥇 '}
                  {index === 1 && '🥈 '}
                  {index === 2 && '🥉 '}
                  {name}
                </span>
                <span>{count}회</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        style={{
          background: 'white',
          padding: '14px',
          borderRadius: '20px',
          marginTop: '20px',
        }}
      >
        <h2 style={{ marginTop: 0 }}>🗓 월간 달력</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '6px',
            marginTop: '12px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#777',
          }}
        >
          <div>일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div>토</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '6px',
            marginTop: '8px',
          }}
        >
          {emptyDays.map((day) => (
            <div key={`empty-${day}`} />
          ))}

          {days.map((date) => {
            const dayChoice = choices?.find((choice) => choice.date === date)
            const hasChoice = !!dayChoice

            const dayBox = (
              <div
                style={{
                  width: '100%',
                  height: '88px',
                  padding: '6px',
                  borderRadius: '12px',
                  background: hasChoice ? '#fff7e6' : '#fafafa',
                  border: hasChoice ? '1px solid #ffd58a' : '1px solid #eee',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  {Number(date.slice(-2))}
                </div>

                {dayChoice && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '10px',
                      lineHeight: '1.3',
                      wordBreak: 'break-all',
                      whiteSpace: 'normal',
                      fontWeight: 'bold',
                    }}
                  >
                    {dayChoice.menu_name}
                  </div>
                )}
              </div>
            )

            if (dayChoice?.menu_id) {
              return (
                <Link
                  key={date}
                  href={`/menu/${dayChoice.menu_id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    width: '100%',
                    minWidth: 0,
                  }}
                >
                  {dayBox}
                </Link>
              )
            }

            return <div key={date}>{dayBox}</div>
          })}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}