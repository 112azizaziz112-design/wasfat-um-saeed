'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const [recipe, setRecipe] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({name: '', ingredients: '', steps: '', time: '', difficulty: ''})
  const router = useRouter()

  useEffect(() => {
    params.then(async ({ id }) => {
      const res = await fetch(`/api/recipes/${id}`)
      const data = await res.json()
      setRecipe(data)
      setForm({
        name: data.name, 
        ingredients: data.ingredients, 
        steps: data.steps, 
        time: data.time.toString(), 
        difficulty: data.difficulty
      })
    })
  }, [])

  async function handleDelete() {
    const pass = prompt('ادخل كلمة سر الأدمن للحذف:')
    if (!pass) return
    const res = await fetch(`/api/recipes/${recipe.id}`, {
      method: 'DELETE',
      body: JSON.stringify({ password: pass })
    })
    if (res.ok) {
      alert('انحذفت الوصفة')
      router.push('/')
    } else alert('كلمة السر غلط')
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    const pass = prompt('ادخل كلمة سر الأدمن للتعديل:')
    if (!pass) return
    const res = await fetch(`/api/recipes/${recipe.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...form, time: parseInt(form.time), password: pass })
    })
    if (res.ok) {
      alert('تعدلت الوصفة')
      setEditMode(false)
      location.reload()
    } else alert('كلمة السر غلط')
  }

  if (!recipe) return <div style={{padding: '40px'}}>جاري التحميل...</div>

  const inputStyle = {padding: '12px', borderRadius: '8px', fontSize: '16px', width: '100%', marginBottom: '15px', background: 'var(--card)', border: '1px solid var(--border)', color: 'inherit'}

  return (
    <div style={{maxWidth: '800px', margin: '40px auto', padding: '20px', minHeight: '100vh'}} dir="rtl">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <Link href={`/country/${recipe.country}`} style={{color: '#FF6B35', textDecoration: 'none', fontWeight: 'bold'}}>← رجوع لأكلات {recipe.country}</Link>
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={()=>setEditMode(!editMode)} style={{background: '#FF6B35', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>{editMode ? 'إلغاء' : 'تعديل'}</button>
          <button onClick={handleDelete} style={{background: '#dc2626', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>حذف الوصفة</button>
        </div>
      </div>
      
      <img src={recipe.image} alt={recipe.name} style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px'}} />
      
      {editMode ? (
        <form onSubmit={handleUpdate} style={{marginTop: '20px'}}>
          <label>اسم الأكلة</label>
          <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} style={inputStyle} />
          <label>الوقت بالدقائق</label>
          <input type="number" value={form.time} onChange={e=>setForm({...form, time: e.target.value})} style={inputStyle} />
          <label>الصعوبة</label>
          <select value={form.difficulty} onChange={e=>setForm({...form, difficulty: e.target.value})} style={inputStyle}>
            <option>سهل</option><option>متوسط</option><option>صعب</option>
          </select>
          <label>المقادير - سطر لكل مقدار</label>
          <textarea value={form.ingredients} onChange={e=>setForm({...form, ingredients: e.target.value})} rows={5} style={inputStyle} />
          <label>طريقة التحضير - سطر لكل خطوة</label>
          <textarea value={form.steps} onChange={e=>setForm({...form, steps: e.target.value})} rows={5} style={inputStyle} />
          <button type="submit" style={{padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%'}}>حفظ التعديلات</button>
        </form>
      ) : (
        <>
          <h1 style={{fontSize: '36px', margin: '20px 0 10px 0'}}>{recipe.name}</h1>
          <div style={{display: 'flex', gap: '20px', marginBottom: '30px', opacity: 0.7}}>
            <span>🌍 {recipe.country}</span>
            <span>⏱️ {recipe.time} دقيقة</span>
            <span>📊 {recipe.difficulty}</span>
          </div>
          <div style={{background: 'var(--card)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px', marginBottom: '20px'}}>
            <h2>المقادير</h2>
            <ul style={{lineHeight: '2'}}>{recipe.ingredients.split('\n').map((ing: string, i: number) => <li key={i}>{ing}</li>)}</ul>
          </div>
          <div style={{background: 'var(--card)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px'}}>
            <h2>طريقة التحضير</h2>
            <ol style={{lineHeight: '2'}}>{recipe.steps.split('\n').map((step: string, i: number) => <li key={i}>{step}</li>)}</ol>
          </div>
        </>
      )}
    </div>
  )
}