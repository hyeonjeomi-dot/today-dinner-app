export async function POST(req: Request) {
  const body = await req.json();

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { error: "DISCORD_WEBHOOK_URL이 없어요." },
      { status: 500 }
    );
  }

  const result = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: body.message,
    }),
  });

  if (!result.ok) {
    return Response.json(
      { error: "디스코드 알림 실패" },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}