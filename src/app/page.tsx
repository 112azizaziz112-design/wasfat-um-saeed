import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
const prisma = new PrismaClient()

export default async function Home() {
  const countries = await prisma.recipe.findMany({ 
    distinct: ['country'], 
    select: { country: true },
    orderBy: { country: 'asc' }
  })

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: '100vh'}} dir="rtl">
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1 style={{color: '#FF6B35'}}>طبخات أم سعيد 🌍</h1>
        <Link href="/add" style={{background: '#FF6B35', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}>+ إضافة وصفة جديدة</Link>
      </header>

      <h2>اختر الدولة</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
        {countries.map(c => (
          <Link key={c.country} href={`/country/${c.country}`} style={{textDecoration: 'none', color: 'inherit'}}>
            <div style={{background: 'var(--card)', border: '1px solid var(--border)', padding: '40px 20px', borderRadius: '12px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold'}}>
              {c.country}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}