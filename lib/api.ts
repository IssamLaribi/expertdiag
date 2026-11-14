const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

export async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(API_URL + path, options);
  } catch {
    throw new Error('Connexion au service impossible. Réessayez dans un instant.');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.detail;
    if (typeof detail === 'string') throw new Error(detail);
    if (response.status === 422) throw new Error('Vérifiez les champs de votre demande.');
    throw new Error('Le service n’a pas pu terminer cette opération. Réessayez.');
  }
  if (payload === null) throw new Error('Réponse du service illisible. Réessayez.');
  return payload as T;
}

export function jsonRequest(method: 'POST' | 'PUT' | 'PATCH', body: object): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
