'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function DeleteButton({
  table,
  id,
  confirmText,
}: {
  table: string;
  id: number | string;
  confirmText: string;
}) {
  const router = useRouter();

  const handleClick = async () => {
    if (!confirm(confirmText)) return;
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      toast.error(`삭제 실패: ${error.message}`);
      return;
    }
    toast.success('삭제되었습니다.');
    router.refresh();
  };

  return (
    <button
      type="button"
      className="admin-btn admin-btn-danger"
      style={{ fontSize: 12, padding: '6px 10px' }}
      onClick={handleClick}
    >
      삭제
    </button>
  );
}
