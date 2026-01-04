import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Shop({ shop, products }) {
  if (!shop) return <h1 className="text-center mt-20">Shop not found!</h1>

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Premium Header */}
      <nav className="sticky top-0 bg-white/70 backdrop-blur-lg border-b p-4 text-center z-50">
        <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
        <p className="text-xs text-blue-600 font-semibold tracking-widest uppercase">Digital Showroom</p>
      </nav>

      {/* Neat Image Grid */}
      <div className="max-w-5xl mx-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {products.map((p) => (
          <div key={p.id} className="aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            <img src={p.image_url} alt="Product" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
        ))}
      </div>

      {products.length === 0 && <p className="text-center text-gray-400 mt-20">No items uploaded yet. Send photos to the bot!</p>}
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { data: shop } = await supabase.from('shops').select('*').eq('slug', params.slug).single()
  if (!shop) return { props: { shop: null } }
  
  const { data: products } = await supabase.from('products').select('*').eq('shop_id', shop.id).order('created_at', { ascending: false })
  return { props: { shop, products } }
}
