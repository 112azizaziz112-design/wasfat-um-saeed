'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddRecipe() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', country: '', image: '', ingredients: '', 
    steps: '', time: '', difficulty: 'سهل'
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/recipes', {
      method: 'POST',
      body: JSON.stringify({...form, time: parseInt(form.time)}),
    })
    router.push('/')
    router.refresh()
  }

  const inputStyle = {padding: '12px', borderRadius: '8px', fontSize: '16px'}

  return (
    <div style={{maxWidth: '600px', margin: '40px auto', padding: '20px', minHeight: '100vh'}} dir="rtl">
      <Link href="/" style={{color: '#FF6B35', textDecoration: 'none', fontWeight: 'bold'}}>← رجوع للرئيسية</Link>
      <h1 style={{marginTop: '20px'}}>إضافة وصفة جديدة</h1>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <input placeholder="اسم الأكلة" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} style={inputStyle} />
        <input placeholder="الدولة" required value={form.country} onChange={e=>setForm({...form, country: e.target.value})} style={inputStyle} />
        <input placeholder="رابط الصورة" required value={form.image} onChange={e=>setForm({...form, image: e.target.value})} style={inputStyle} />
        <input placeholder="الوقت بالدقائق" type="number" required value={form.time} onChange={e=>setForm({...form, time: e.target.value})} style={inputStyle} />
        <select value={form.difficulty} onChange={e=>setForm({...form, difficulty: e.target.value})} style={inputStyle}>
          <option>سهل</option><option>متوسط</option><option>صعب</option>
        </select>
        <textarea placeholder="المقادير - كل سطر مكون" required rows={5} value={form.ingredients} onChange={e=>setForm({...form, ingredients: e.target.value})} style={inputStyle} />
        <textarea placeholder="طريقة التحضير - كل سطر خطوة" required rows={5} value={form.steps} onChange={e=>setForm({...form, steps: e.target.value})} style={inputStyle} />
        <button type="submit" style={{padding: '15px', background: '#FF6B35', color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px', borderRadius: '8px', fontWeight: 'bold'}}>حفظ الوصفة</button>
      </form>
    </div>
  )
}