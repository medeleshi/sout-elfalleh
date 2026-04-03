import React from "react";
import { 
  Users, 
  MapPin, 
  ArrowLeft
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface SuggestedTradersProps {
  currentUserId: string;
}

export default async function SuggestedTraders({ currentUserId }: SuggestedTradersProps) {
  const supabase = await createClient();

  // Fetch some suggested traders
  // Forcing type via 'as any' to avoid complex join inference issues in this specific view
  const { data: traders, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      avatar_url,
      role,
      governorates:governorate_id(name_ar)
    `)
    .neq('id', currentUserId)
    .not('role', 'is', null)
    .limit(4) as { data: any[] | null; error: any };

  if (error || !traders || traders.length === 0) return null;

  return (
    <section className="bg-surface rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-outline-variant/5 bg-surface-container-low flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-black text-on-surface">تجار ننصح بمتابعتهم</h3>
        </div>
      </div>

      <div className="p-4 space-y-1">
        {traders.map((trader) => (
          <div key={trader.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-all group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest border border-outline-variant/10 overflow-hidden flex items-center justify-center">
                  {trader.avatar_url ? (
                    <img src={trader.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-5 h-5 text-on-surface-variant/40" />
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary border-2 border-surface rounded-full" />
              </div>

              <div>
                <h4 className="text-xs font-black text-on-surface leading-tight group-hover:text-primary transition-colors">
                  {trader.full_name || 'تاجر مجهول'}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-on-surface-variant/60 font-bold">
                    {trader.role === 'farmer' ? 'فلاح' : trader.role === 'buyer' ? 'مشتري' : 'تاجر'}
                  </span>
                  <span className="w-0.5 h-0.5 bg-outline-variant/40 rounded-full" />
                  <div className="flex items-center gap-0.5 text-[9px] text-primary font-black uppercase">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{trader.governorates?.name_ar || 'تونس'}</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-on-primary transition-all opacity-0 group-hover:opacity-100">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 pt-0">
        <Link 
          href="/traders"
          className="w-full py-3 rounded-xl border border-primary/10 text-primary text-[11px] font-black flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
        >
          <span>استكشف كافة التجار</span>
          <ArrowLeft className="w-3 h-3" />
        </Link>
      </div>
    </section>
  );
}
