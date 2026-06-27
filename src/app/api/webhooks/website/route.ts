import { handleWebhook } from '../_handler';

export async function POST(req: Request) {
  return handleWebhook(req, 'Website');
}
