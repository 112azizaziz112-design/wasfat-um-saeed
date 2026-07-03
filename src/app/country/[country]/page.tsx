import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const decodedCountry = decodeURIComponent(country)
  
  const recipes = await prisma.recipe.findMany({ 
    where: { country: decodedCountry },
    orderBy: { createdAt: 'desc' }
  })

  if (recipes.length === 0) return notFound()

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: '100vh'}} dir="rtl">
      <Link href="/" style={{color: '#FF6B35', textDecoration: 'none', fontWeight: 'bold'}}>← رجوع للدول</Link>
      <h1 style={{marginTop: '20px', fontSize: '32px'}}>أكلات {decodedCountry}</h1>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px'}}>
        {recipes.map(recipe => (
          <Link key={recipe.id} href={`/recipe/${recipe.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
            <div style={{borderRadius: '12px', overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)'}}>
              <img src={recipe.image} alt={recipe.name} style={{width: '100%', height: '200px', objectFit: 'cover'}} />
              <div style={{padding: '15px'}}>
                <h3 style={{margin: '0 0 8px 0'}}>{recipe.name}</h3>
                <p style={{margin: 0, opacity: 0.7}}>{recipe.time} دقيقة • {recipe.difficulty}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}