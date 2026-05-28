'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import BottomNav from '../../components/BottomNav'

type StorageType = '냉장' | '냉동'

type FridgeItem = {
  id: number
  name: string
  quantity: string
  amount: number | null
  expire_date: string | null
  created_at: string
  storage_type: StorageType | null
}

export default function FridgePage() {
  const [items, setItems] = useState<FridgeItem[]>([])
  const [showStatus, setShowStatus] = useState(false)
  const [showForm, setShowForm] = useState(false)
const [sortType, setSortType] = useState<'name' | 'expire'>('expire')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(1)
  const [expireDate, setExpireDate] = useState('')
  const [storageType, setStorageType] = useState<StorageType>('냉장')
  const [editingId, setEditingId] = useState<number | null>(null)

  const fetchItems = async () => {
    const { data } = await supabase
      .from('fridge_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setItems(data)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const sortedItems = [...items].sort((a, b) => {
  if (sortType === 'name') {
    return a.name.localeCompare(b.name, 'ko')
  }

  const aDate = a.expire_date || '9999-12-31'
  const bDate = b.expire_date || '9999-12-31'

  return aDate.localeCompare(bDate)
})

  const storageDays: Record<string, { 냉장: number; 냉동: number }> = {
    파: { 냉장: 7, 냉동: 30 },
    대파: { 냉장: 7, 냉동: 30 },
    고추: { 냉장: 5, 냉동: 60 },
    청양고추: { 냉장: 5, 냉동: 60 },
    양파: { 냉장: 14, 냉동: 60 },
    감자: { 냉장: 30, 냉동: 90 },
    두부: { 냉장: 3, 냉동: 30 },
    우유: { 냉장: 5, 냉동: 30 },
    계란: { 냉장: 14, 냉동: 0 },
  }

  const getAutoExpireDate = () => {
    if (expireDate) return expireDate

    const matched = storageDays[name]
    if (!matched) return null

    const days = matched[storageType]
    if (!days) return null

    const date = new Date()
    date.setDate(date.getDate() + days)

    return date.toISOString().split('T')[0]
  }

  const resetForm = () => {
    setName('')
    setAmount(1)
    setExpireDate('')
    setStorageType('냉장')
    setEditingId(null)
    setShowForm(false)
  }

  const handleSave = async () => {
    if (!name || amount < 1) {
      alert('재료 이름과 수량을 입력해주세요!')
      return
    }

    const payload = {
      name,
      amount,
      quantity: String(amount),
      storage_type: storageType,
      expire_date: getAutoExpireDate(),
    }

    if (editingId) {
      const { error } = await supabase
        .from('fridge_items')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        alert('수정 실패 😢')
        console.log(error)
        return
      }
    } else {
      const { error } = await supabase.from('fridge_items').insert([payload])

      if (error) {
        alert('추가 실패 😢')
        console.log(error)
        return
      }
    }

    resetForm()
    fetchItems()
  }

  const updateAmount = async (item: FridgeItem, nextAmount: number) => {
    if (nextAmount < 1) {
  deleteItem(item.id)
  return
}

    const { error } = await supabase
      .from('fridge_items')
      .update({
        amount: nextAmount,
        quantity: `${nextAmount}개`,
      })
      .eq('id', item.id)

    if (error) {
      alert('수량 변경 실패 😢')
      console.log(error)
      return
    }

    fetchItems()
  }

  const extendExpireDate = async (item: FridgeItem, days: number) => {
    const baseDate = item.expire_date ? new Date(item.expire_date) : new Date()
    baseDate.setDate(baseDate.getDate() + days)

    const nextDate = baseDate.toISOString().split('T')[0]

    const { error } = await supabase
      .from('fridge_items')
      .update({ expire_date: nextDate })
      .eq('id', item.id)

    if (error) {
      alert('유통기한 연장 실패 😢')
      console.log(error)
      return
    }

    fetchItems()
  }

  const deleteItem = async (id: number) => {
    const ok = confirm('이 재료를 삭제할까요?')
    if (!ok) return

    const { error } = await supabase
      .from('fridge_items')
      .delete()
      .eq('id', id)

    if (error) {
      alert('삭제 실패 😢')
      console.log(error)
      return
    }

    fetchItems()
  }

  const handleEdit = (item: FridgeItem) => {
    setEditingId(item.id)
    setName(item.name)
    setAmount(item.amount || Number.parseInt(item.quantity) || 1)
    setExpireDate(item.expire_date || '')
    setStorageType(item.storage_type || '냉장')
    setShowForm(true)
  }

  const getDDay = (date: string | null) => {
    if (!date) return '기한 없음'

    const today = new Date()
const expire = new Date(date)

today.setHours(0, 0, 0, 0)
expire.setHours(0, 0, 0, 0)

const diff = Math.floor(
  (expire.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24)
)

if (diff < 0) return '만료'
if (diff === 0) return 'D-Day'

return `D-${diff}`
  }

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
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>🧊 냉장고</h1>

      <p style={{ color: '#666', textAlign: 'center' }}>
        냉장/냉동 재료를 관리해보세요.
      </p>

      <button onClick={() => setShowStatus(!showStatus)} style={bannerStyle}>
        1. 현재 냉장고 상황 보기
      </button>

      {showStatus && (
        <section style={boxStyle}>
            <div
  style={{
    display: 'flex',
    gap: '8px',
    marginBottom: '14px',
  }}
>
  <button
    onClick={() => setSortType('expire')}
    style={{
      ...sortButtonStyle,
      background:
        sortType === 'expire' ? 'orange' : '#eee',
      color:
        sortType === 'expire' ? 'white' : '#333',
    }}
  >
    유통기한순
  </button>

  <button
    onClick={() => setSortType('name')}
    style={{
      ...sortButtonStyle,
      background:
        sortType === 'name' ? 'orange' : '#eee',
      color:
        sortType === 'name' ? 'white' : '#333',
    }}
  >
    이름순
  </button>
</div>
          {items.length === 0 ? (
            <p style={{ color: '#666' }}>등록된 재료가 없어요.</p>
          ) : (
            <div
  style={{
    display: 'grid',
    gap: '12px',
    width: '100%',
  }}
>
              {sortedItems.map((item) => {
                const isEditing = editingId === item.id
                const currentAmount =
                  item.amount || Number.parseInt(item.quantity) || 1

                return (
                  <div key={item.id} style={itemCardStyle}>
                    <div style={{ flex: 1 }}>
  {isEditing ? (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={inputStyle}
      />

      <input
        type="date"
        value={expireDate}
        onChange={(e) => setExpireDate(e.target.value)}
        style={inputStyle}
      />

      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '10px',
        }}
      >
        <button onClick={handleSave} style={miniActionStyle}>
          저장
        </button>

        <button
          onClick={() => setEditingId(null)}
          style={deleteButtonStyle}
        >
          취소
        </button>
      </div>
    </>
  ) : (
    <>
      <h3
        style={{
          margin: 0,
          fontSize: '22px',
          fontWeight: 'bold',
        }}
      >
        {item.storage_type === '냉동' ? '❄️' : '🧊'} {item.name}
      </h3>

      <p
        style={{
          margin: '8px 0 0',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111',
        }}
      >
        현재 수량: {currentAmount}개
      </p>

      <p style={{ margin: '6px 0 0', color: '#666' }}>
        {item.storage_type || '냉장'} · {getDDay(item.expire_date)}
      </p>

      <p
        style={{
          margin: '6px 0 0',
          fontSize: '12px',
          color: '#999',
        }}
      >
        {item.expire_date || '유통기한 없음'}
      </p>
    </>
  )}
</div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={() => updateAmount(item, currentAmount - 1)}
                          style={smallButtonStyle}
                        >
                          -
                        </button>

                       <strong style={{ fontSize: '24px' }}>
  {currentAmount}개
</strong>

                        <button
                          onClick={() => updateAmount(item, currentAmount + 1)}
                          style={smallButtonStyle}
                        >
                          +
                        </button>
                      </div>

                      <div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '10px',
    justifyContent: 'flex-end',
  }}
>
  <button
    onClick={() => extendExpireDate(item, 3)}
    style={miniActionStyle}
  >
    +3일
  </button>

  <button
    onClick={() => extendExpireDate(item, 7)}
    style={miniActionStyle}
  >
    +7일
  </button>

  <button
  onClick={() => {
    setEditingId(item.id)
    setName(item.name)
    setAmount(currentAmount)
    setExpireDate(item.expire_date || '')
  }}
    style={miniActionStyle}
  >
    수정
  </button>

  <button
    onClick={() => deleteItem(item.id)}
    style={deleteButtonStyle}
  >
    삭제
  </button>
</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}

      <button onClick={() => setShowForm(true)} style={bannerStyle}>
        2. 재료 추가하기
      </button>

      {showForm && (
        <section style={boxStyle}>
          <h2>{editingId ? '✏️ 재료 수정' : '➕ 재료 추가'}</h2>

          <input
            placeholder="재료 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
  type="number"
  min="0"
  step="0.5"
  value={amount}
  onChange={(e) => setAmount(Number(e.target.value))}
  style={inputStyle}
/>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            <button
              onClick={() => setStorageType('냉장')}
              style={{
                ...selectButtonStyle,
                background: storageType === '냉장' ? 'orange' : '#eee',
                color: storageType === '냉장' ? 'white' : '#333',
              }}
            >
              🧊 냉장
            </button>

            <button
              onClick={() => setStorageType('냉동')}
              style={{
                ...selectButtonStyle,
                background: storageType === '냉동' ? '#4aa3ff' : '#eee',
                color: storageType === '냉동' ? 'white' : '#333',
              }}
            >
              ❄️ 냉동
            </button>
          </div>

          <input
            type="date"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
            style={inputStyle}
          />

          <p style={{ fontSize: '12px', color: '#888' }}>
            유통기한을 비우면 일부 재료는 보관 방식에 따라 자동 계산돼요.
          </p>

          <button onClick={handleSave} style={saveButtonStyle}>
            {editingId ? '수정 완료' : '저장하기'}
          </button>

          <button onClick={resetForm} style={cancelButtonStyle}>
            취소
          </button>
        </section>
      )}
<section style={boxStyle}>
  <h2
    style={{
      marginTop: 0,
      marginBottom: '14px',
    }}
  >
    🚨 유통기한 임박재료
  </h2>

  {items.filter((item) => {
    if (!item.expire_date) return false

    const today = new Date()
    const expire = new Date(item.expire_date)

    const diff = Math.ceil(
      (expire.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    )

    return diff <= 3
  }).length === 0 ? (
    <p style={{ color: '#666', margin: 0 }}>
      임박한 재료가 없어요 😎
    </p>
  ) : (
    <div
      style={{
        display: 'grid',
        gap: '10px',
      }}
    >
      {items
        .filter((item) => {
          if (!item.expire_date) return false

          const today = new Date()
          const expire = new Date(item.expire_date)

          const diff = Math.ceil(
            (expire.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          )

          return diff <= 3
        })
        .map((item) => {
          const currentAmount =
            item.amount ||
            Number.parseFloat(item.quantity) ||
            1

          return (
            <div
              key={item.id}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#fff4f4',
                border: '1px solid #ffd6d6',
                padding: '14px',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div>
                <strong style={{ fontSize: '18px' }}>
                  {item.name}
                </strong>

                <p
                  style={{
                    margin: '6px 0 0',
                    color: '#666',
                  }}
                >
                  현재 수량: {currentAmount}개
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <strong
                  style={{
                    color: '#d00',
                    fontSize: '18px',
                  }}
                >
                  {getDDay(item.expire_date)}
                </strong>

                <p
                  style={{
                    margin: '6px 0 0',
                    fontSize: '12px',
                    color: '#888',
                  }}
                >
                  {item.expire_date}
                </p>
              </div>
            </div>
          )
        })}
    </div>
  )}
</section>

      <BottomNav />
    </main>
  )
}

const bannerStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '18px',
  borderRadius: '20px',
  border: 'none',
  background: 'white',
  fontWeight: 'bold',
  fontSize: '17px',
  marginTop: '20px',
  textAlign: 'left' as const,
}

const boxStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  background: 'white',
  padding: '18px',
  borderRadius: '20px',
  marginTop: '12px',
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '14px',
  border: '1px solid #ddd',
  marginTop: '12px',
  boxSizing: 'border-box' as const,
}

const selectButtonStyle = {
  padding: '14px',
  borderRadius: '14px',
  border: 'none',
  fontWeight: 'bold',
  marginTop: '12px',
}

const saveButtonStyle = {
  width: '100%',
  padding: '16px',
  borderRadius: '16px',
  border: 'none',
  background: 'orange',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '16px',
  marginTop: '16px',
}

const cancelButtonStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '16px',
  border: 'none',
  background: '#eee',
  color: '#333',
  fontWeight: 'bold',
  fontSize: '15px',
  marginTop: '10px',
}

const itemCardStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  background: '#fafafa',
  padding: '16px',
  borderRadius: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
}

const smallButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '999px',
  border: 'none',
  background: 'orange',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '18px',
}

const miniActionStyle = {
  padding: '7px 9px',
  borderRadius: '10px',
  border: 'none',
  background: '#eee',
  fontWeight: 'bold',
  fontSize: '12px',
}

const deleteButtonStyle = {
  padding: '7px 9px',
  borderRadius: '10px',
  border: 'none',
  background: '#ffdddd',
  color: '#d00',
  fontWeight: 'bold',
  fontSize: '12px',
}
const sortButtonStyle = {
  flex: 1,
  padding: '12px',
  borderRadius: '14px',
  border: 'none',
  fontWeight: 'bold',
}