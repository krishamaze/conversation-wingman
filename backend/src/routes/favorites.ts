import express, { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import supabase from '../config/supabase';

const router = express.Router();

interface AuthedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string;
  headers: Request['headers'];
  query: ReqQuery;
  params: P;
  body: ReqBody;
}

const auth = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.userId = data.user.id;
  next();
};

router.use(auth);

interface FavoritesQuery {
  page?: string;
  limit?: string;
  search?: string;
}

router.get('/', async (req: AuthedRequest<ParamsDictionary, any, any, FavoritesQuery>, res: Response) => {
  const { page = '1', limit = '10', search = '' } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const from = (pageNum - 1) * limitNum;
  const to = from + limitNum - 1;

  const query = supabase
    .from('favorites')
    .select('*', { count: 'exact' })
    .eq('user_id', req.userId)
    .ilike('phrase', `%${search}%`)
    .range(from, to)
    .order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data, page: pageNum, limit: limitNum, total: count });
});

interface FavoriteBody {
  phrase: string;
}

router.post('/', async (req: AuthedRequest<ParamsDictionary, any, FavoriteBody>, res: Response) => {
  const { phrase } = req.body;
  if (!phrase || typeof phrase !== 'string') {
    return res.status(400).json({ error: 'Phrase is required' });
  }

  const { data, error } = await supabase
    .from('favorites')
    .insert({ phrase, user_id: req.userId })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

interface DeleteParams extends ParamsDictionary {
  id: string;
}

router.delete('/:id', async (req: AuthedRequest<DeleteParams>, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(204).send();
});

export default router;
