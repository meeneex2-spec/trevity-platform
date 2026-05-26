import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

const InquirySchema = z.object({
  name: z.string().min(1).max(60),
  email: z.string().email(),
  sns_platform: z.string().optional(),
  sns_handle: z.string().max(80).optional(),
  follower_count: z.string().max(40).optional(),
  country_interest: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = InquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다.', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('inquiries').insert({
      ...parsed.data,
      source: 'landing_cta',
      status: 'new',
    });

    if (error) {
      console.error('Inquiry insert error:', error);
      return NextResponse.json(
        { error: '저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Inquiry route error:', err);
    return NextResponse.json(
      { error: '서버 오류입니다.' },
      { status: 500 }
    );
  }
}
