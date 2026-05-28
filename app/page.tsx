import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import BottomNav from '../components/BottomNav'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
 
  const today = new Date().toISOString().slice(0, 10)

  const { data: choices } = await supabase
  .from('dinner_choices')
  .select('*')
  .eq('date', today)
  .order('id', { ascending: false })

  const { data: fridgeItems } = await supabase
    .from('fridge_items')
    .select('*')

  const { data: menus } = await supabase
    .from('menus')
    .select('*')

  const hyunjungChoice = choices?.find((choice) => choice.person === '현정')
  const sanghyukChoice = choices?.find((choice) => choice.person === '상혁')

  const isSameMenu =
    hyunjungChoice &&
    sanghyukChoice &&
    hyunjungChoice.menu_name === sanghyukChoice.menu_name

  const fridgeNames = fridgeItems?.map((item) => item.name.trim()) || []

  const recommendedMenus =
    menus
      ?.map((menu) => {
        const ingredientsText = menu.ingredients || ''

        const matchedIngredients = fridgeNames.filter((name) =>
          ingredientsText.includes(name)
        )

        return {
          ...menu,
          matchedCount: matchedIngredients.length,
          matchedIngredients,
        }
      })
      .filter((menu) => menu.matchedCount > 0)
      .sort((a, b) => b.matchedCount - a.matchedCount)
      .slice(0, 3) || []

  return (
    <main
      style={{
        padding: '18px',
        paddingBottom: '90px',
        maxWidth: '520px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        background: 'linear-gradient(180deg, #fff3df 0%, #fffaf3 45%)',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ marginTop: '8px' }}>
        <p
          style={{
            margin: 0,
            color: '#f28c00',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          오늘의 메뉴 기록
        </p>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: '900',
            margin: '6px 0 0',
            letterSpacing: '-1px',
          }}
        >
          😋 오늘 뭐 먹지?
        </h1>

        <p
          style={{
            marginTop: '8px',
            color: '#777',
            fontSize: '15px',
          }}
        >
          오늘 선택한 저녁과 냉장고 추천 메뉴를 확인해보세요.
        </p>
      </div>

      <section
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '24px',
          marginTop: '22px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <div style={choiceCardStyle}>
            <p style={labelStyle}>현정이의 선택</p>
            <h2 style={choiceTextStyle}>
              {hyunjungChoice?.menu_name || '아직 선택 안 함'}
            </h2>
          </div>

          <div style={choiceCardStyle}>
            <p style={labelStyle}>상혁이의 선택</p>
            <h2 style={choiceTextStyle}>
              {sanghyukChoice?.menu_name || '아직 선택 안 함'}
            </h2>
          </div>
        </div>

        {hyunjungChoice && sanghyukChoice && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: '18px',
              background: isSameMenu ? '#fff0d9' : '#f5f5f5',
              fontWeight: 'bold',
              textAlign: 'center',
              color: isSameMenu ? '#d97706' : '#555',
            }}
          >
            {isSameMenu ? '❤️ 오늘은 같은 메뉴!' : '🤔 오늘은 서로 다른 메뉴!'}
          </div>
        )}

        <Link href="/menu">
          <button
            style={{
              marginTop: '18px',
              width: '100%',
              padding: '16px',
              borderRadius: '18px',
              border: 'none',
              background: 'linear-gradient(135deg, #ff9f1c, #ff7a00)',
              color: 'white',
              fontWeight: '900',
              fontSize: '16px',
              boxShadow: '0 6px 16px rgba(255, 122, 0, 0.25)',
            }}
          >
            메뉴 고르러 가기
          </button>
        </Link>
      </section>

      <section
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '24px',
          marginTop: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: '#f28c00',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              냉장고 기반 추천
            </p>

            <h2 style={{ margin: '4px 0 0', fontSize: '22px' }}>
              🍳 지금 만들 수 있는 메뉴
            </h2>
          </div>

          <Link
            href="/recommend"
            style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: '#ff7a00',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            더보기
          </Link>
        </div>

        {recommendedMenus.length === 0 ? (
          <div
            style={{
              marginTop: '16px',
              padding: '18px',
              borderRadius: '18px',
              background: '#fafafa',
              color: '#666',
              textAlign: 'center',
            }}
          >
            냉장고 재료와 맞는 메뉴가 아직 없어요.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {recommendedMenus.map((menu, index) => (
              <Link
                key={menu.id}
                href={`/menu/${menu.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '20px',
                    background: index === 0 ? '#fff7e6' : '#fafafa',
                    border:
                      index === 0 ? '1px solid #ffd58a' : '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#f28c00',
                        fontWeight: 'bold',
                      }}
                    >
                      재료 {menu.matchedCount}개 매칭
                    </p>

                    <h3
                      style={{
                        margin: '5px 0 0',
                        fontSize: '20px',
                        fontWeight: '900',
                      }}
                    >
                      {index === 0 ? '🥇 ' : ''}
                      {menu.name}
                    </h3>

                    <p
                      style={{
                        margin: '6px 0 0',
                        color: '#888',
                        fontSize: '13px',
                      }}
                    >
                      {menu.matchedIngredients.join(', ')}
                    </p>
                  </div>

                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '999px',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#ff7a00',
                      flexShrink: 0,
                    }}
                  >
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  )
}

const choiceCardStyle = {
  background: '#fff7e6',
  border: '1px solid #ffe0a3',
  borderRadius: '20px',
  padding: '16px',
  minHeight: '110px',
  boxSizing: 'border-box' as const,
}

const labelStyle = {
  margin: 0,
  color: '#d97706',
  fontSize: '13px',
  fontWeight: 'bold',
}

const choiceTextStyle = {
  margin: '10px 0 0',
  fontSize: '22px',
  fontWeight: '900',
  lineHeight: 1.25,
}